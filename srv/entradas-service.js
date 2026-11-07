const cds = require('@sap/cds');

/**
 * EntradasService — goods receipt (Producción, Pedido, Entrega, Devolución, OTs de entrada).
 *
 * Handlers contain the business validation/orchestration. The real posting
 * against SAP LE-WM/MM-IM is marked with "// >>> INTEGRACIÓN SAP:" and is
 * simulated here so the app runs locally on SQLite.
 *
 * Writes go to the db entities (mfw.wm.*), not the read-only service projections.
 */
module.exports = cds.service.impl(async function () {
  const { ProductionOrders, PurchaseOrderItems, InboundDeliveries, ReturnDeliveries, TransferOrders, TransferOrderItems } = cds.entities('mfw.wm');

  const error = (text, field) => ({ success: false, messages: [{ severity: 'E', text, field }] });
  const ok = (text, materialDoc = '5000000001') => ({
    success: true, materialDoc, year: String(new Date().getFullYear()), messages: [{ severity: 'S', text }]
  });

  // 1) Producción -----------------------------------------------------
  this.on('postProductionGoodsReceipt', async (req) => {
    const { AUFNR, MENGE } = req.data;
    const order = await SELECT.one.from(ProductionOrders).where({ AUFNR });
    if (!order) return error(`Orden ${AUFNR} no encontrada.`, 'AUFNR');
    if (!(MENGE > 0)) return error('La cantidad debe ser mayor que 0.', 'MENGE');
    const pendiente = Number(order.GAMNG || 0) - Number(order.GWEMG || 0);
    if (MENGE > pendiente) return error(`Cantidad ${MENGE} supera lo pendiente por ingresar (${pendiente}).`, 'MENGE');
    if (order.MENGE_MAX && MENGE > order.MENGE_MAX) return error(`Cantidad ${MENGE} supera el máximo por estiba (${order.MENGE_MAX}).`, 'MENGE');
    // >>> INTEGRACIÓN SAP: BAPI_GOODSMVT_CREATE (mov. 101, referencia AUFNR)
    await UPDATE(ProductionOrders).set({ GWEMG: { '+=': MENGE } }).where({ AUFNR });
    return ok(`Entrada de ${MENGE} ${order.MEINS} contabilizada para la orden ${AUFNR}.`);
  });

  // 2) Maquila / Comercializados (por pedido) --------------------------
  this.on('postPurchaseOrderGoodsReceipt', async (req) => {
    const { EBELN, EBELP, MATNR, MENGE } = req.data;
    if (!EBELN || !MATNR || !(MENGE > 0)) return error('Pedido, material y cantidad son obligatorios.');
    const item = await SELECT.one.from(PurchaseOrderItems).where({ EBELN, EBELP });
    if (!item) return error(`Posición ${EBELP} del pedido ${EBELN} no encontrada.`, 'EBELP');
    if (item.MATNR !== MATNR) return error(`El material ${MATNR} no corresponde a la posición ${EBELP} del pedido.`, 'MATNR');
    if (MENGE > item.MENGE) return error(`Cantidad ${MENGE} supera la cantidad del pedido (${item.MENGE}).`, 'MENGE');
    // >>> INTEGRACIÓN SAP: BAPI_GOODSMVT_CREATE (mov. 101, referencia EBELN/EBELP)
    return ok(`Entrada de ${MENGE} ${item.MEINS} contabilizada para el pedido ${EBELN}/${EBELP}.`);
  });

  // 3) Entrada por Entrega ---------------------------------------------
  this.on('postDeliveryGoodsReceipt', async (req) => {
    const { VBELN, items } = req.data;
    if (!VBELN || !items?.length) return error('Entrega y al menos una posición son obligatorias.');
    const delivery = await SELECT.one.from(InboundDeliveries).where({ VBELN });
    if (!delivery) return error(`Entrega ${VBELN} no encontrada.`, 'VBELN');
    // >>> INTEGRACIÓN SAP: BAPI_GOODSMVT_CREATE / VL_STOCK_TRANSFER (referencia VBELN)
    return ok(`Entrada por entrega ${VBELN} contabilizada (${items.length} posición(es)).`);
  });

  // 4) Entrada por Devolución -------------------------------------------
  this.on('postReturnGoodsReceipt', async (req) => {
    const { VBELN, items } = req.data;
    if (!VBELN || !items?.length) return error('Entrega de devolución y posiciones son obligatorias.');
    const ret = await SELECT.one.from(ReturnDeliveries).where({ VBELN });
    if (!ret) return error(`Devolución ${VBELN} no encontrada.`, 'VBELN');
    // >>> INTEGRACIÓN SAP: BAPI_GOODSMVT_CREATE (mov. 651)
    return ok(`Devolución ${VBELN} contabilizada (${items.length} posición(es)).`);
  });

  // 5) Confirmación de OT de entrada (put-away) --------------------------
  this.on('confirmInboundTransferOrder', async (req) => {
    const { LGNUM, TANUM, TAPOS, LENUM, NLPLA } = req.data;
    const item = await SELECT.one.from(TransferOrderItems).where({ LGNUM, TANUM, TAPOS });
    if (!item) return { success: false, TANUM, TAPOS, messages: [{ severity: 'E', text: `OT ${TANUM}/${TAPOS} no encontrada.` }] };
    if (item.confirmed) return { success: false, TANUM, TAPOS, messages: [{ severity: 'E', text: `OT ${TANUM}/${TAPOS} ya está confirmada.` }] };
    if (LENUM && item.LENUM && LENUM !== item.LENUM) {
      return { success: false, TANUM, TAPOS, messages: [{ severity: 'E', text: `La HU ${LENUM} no corresponde a la OT (esperada ${item.LENUM}).`, field: 'LENUM' }] };
    }
    const bin = NLPLA || item.NLPLA;
    // >>> INTEGRACIÓN SAP: BAPI_TRANSFERORDER_CONFIRM (LT12 equivalente)
    await UPDATE(TransferOrderItems).set({ confirmed: true, VERME: item.GAMNG, NLPLA: bin }).where({ LGNUM, TANUM, TAPOS });
    await closeTransferOrderIfDone(LGNUM, TANUM);
    return { success: true, TANUM, TAPOS, messages: [{ severity: 'S', text: `OT ${TANUM}/${TAPOS} confirmada. HU ${LENUM || item.LENUM} ubicada en ${bin}.` }] };
  });

  async function closeTransferOrderIfDone(LGNUM, TANUM) {
    const open = await SELECT.one.from(TransferOrderItems).where({ LGNUM, TANUM, confirmed: false });
    await UPDATE(TransferOrders).set({ status: open ? 'PARTIAL' : 'CONFIRMED' }).where({ LGNUM, TANUM });
  }
});
