const cds = require('@sap/cds');

/**
 * SalidasService — goods issue (Separación, Cargue, Contabilizar SM, OTs de salida).
 * Writes go to the db entities (mfw.wm.*), not the read-only service projections.
 */
module.exports = cds.service.impl(async function () {
  const { OutboundDocuments, TransferOrders, TransferOrderItems } = cds.entities('mfw.wm');

  const error = (text, field) => ({ success: false, messages: [{ severity: 'E', text, field }] });

  // Separación requires an OPEN document; Cargue requires a PICKED one
  const REQUIRED_STATUS = { PICKED: 'OPEN', LOADED: 'PICKED' };

  async function confirmByRef(field, value, kind, items) {
    if (!value || !items?.length) return error(`${field} y al menos una posición son obligatorios.`, field);
    const doc = await SELECT.one.from(OutboundDocuments).where({ [field]: value });
    if (!doc) return error(`Documento ${field} ${value} no encontrado.`, field);
    if (doc.pickStatus !== REQUIRED_STATUS[kind]) {
      return error(`El documento ${value} debe estar en estado ${REQUIRED_STATUS[kind]} (estado actual: ${doc.pickStatus}).`);
    }
    // >>> INTEGRACIÓN SAP: BAPI_TRANSFERORDER_CONFIRM por cada posición de picking
    await UPDATE(OutboundDocuments).set({ pickStatus: kind }).where({ [field]: value });
    return { success: true, messages: [{ severity: 'S', text: `${kind === 'PICKED' ? 'Separación' : 'Cargue'} confirmado(a) para ${field} ${value}.` }] };
  }

  this.on('confirmPickingByTransportDoc', (req) => confirmByRef('TKNUM', req.data.TKNUM, 'PICKED', req.data.items));
  this.on('confirmPickingByDelivery',     (req) => confirmByRef('VBELN', req.data.VBELN, 'PICKED', req.data.items));
  this.on('confirmLoadingByTransportDoc', (req) => confirmByRef('TKNUM', req.data.TKNUM, 'LOADED', req.data.items));
  this.on('confirmLoadingByDelivery',     (req) => confirmByRef('VBELN', req.data.VBELN, 'LOADED', req.data.items));

  // Contabilizar Salida de Mercancía (Post Goods Issue) ------------------
  this.on('postGoodsIssue', async (req) => {
    const { TKNUM } = req.data;
    const doc = await SELECT.one.from(OutboundDocuments).where({ TKNUM });
    if (!doc) return error(`Documento de transporte ${TKNUM} no encontrado.`, 'TKNUM');
    if (doc.pickStatus !== 'LOADED') {
      return error(`El DT ${TKNUM} debe estar Cargado antes de contabilizar la salida (estado actual: ${doc.pickStatus}).`);
    }
    // >>> INTEGRACIÓN SAP: BAPI_GOODSMVT_CREATE (mov. 601/641) o VL_COMPLETE (PGI de entrega)
    await UPDATE(OutboundDocuments).set({ pickStatus: 'PGI_DONE' }).where({ TKNUM });
    return { success: true, materialDoc: '4900000001', year: String(new Date().getFullYear()), messages: [{ severity: 'S', text: `Salida de mercancía contabilizada para DT ${TKNUM}.` }] };
  });

  // Confirmación de OT de salida a nivel de HU ----------------------------
  this.on('confirmOutboundTransferOrder', async (req) => {
    const { LGNUM, TANUM, TAPOS, LENUM, confirmedQty } = req.data;
    const item = await SELECT.one.from(TransferOrderItems).where({ LGNUM, TANUM, TAPOS });
    if (!item) return { success: false, TANUM, TAPOS, messages: [{ severity: 'E', text: `OT ${TANUM}/${TAPOS} no encontrada.` }] };
    if (item.confirmed) return { success: false, TANUM, TAPOS, messages: [{ severity: 'E', text: `OT ${TANUM}/${TAPOS} ya está confirmada.` }] };
    if (!(confirmedQty > 0) || confirmedQty > item.GAMNG) {
      return { success: false, TANUM, TAPOS, messages: [{ severity: 'E', text: `Cantidad confirmada debe estar entre 0 y ${item.GAMNG}.`, field: 'confirmedQty' }] };
    }
    // >>> INTEGRACIÓN SAP: BAPI_TRANSFERORDER_CONFIRM
    await UPDATE(TransferOrderItems).set({ confirmed: true, VERME: confirmedQty }).where({ LGNUM, TANUM, TAPOS });
    const open = await SELECT.one.from(TransferOrderItems).where({ LGNUM, TANUM, confirmed: false });
    await UPDATE(TransferOrders).set({ status: open ? 'PARTIAL' : 'CONFIRMED' }).where({ LGNUM, TANUM });
    return { success: true, TANUM, TAPOS, messages: [{ severity: 'S', text: `OT ${TANUM}/${TAPOS} confirmada para HU ${LENUM || item.LENUM} (cantidad ${confirmedQty}).` }] };
  });
});
