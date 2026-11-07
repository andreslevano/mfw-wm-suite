const cds = require('@sap/cds');

/**
 * TraspasosService — bin-to-bin transfers (completo / parcial).
 * Writes go to the db entities (mfw.wm.*), not the read-only service projections.
 */
module.exports = cds.service.impl(async function () {
  const { StockItems, BinTransferRequests } = cds.entities('mfw.wm');

  const error = (text, field) => ({ success: false, messages: [{ severity: 'E', text, field }] });
  const newTANUM = () => String(Math.floor(1000000 + Math.random() * 8999999)).padStart(10, '0');

  function validateBins(sourceBin, destBin) {
    if (!sourceBin || !destBin) return error('Ubicación origen y destino son obligatorias.');
    if (sourceBin === destBin) return error('La ubicación destino no puede ser igual a la de origen.', 'destBin');
  }

  // Traspaso COMPLETO ------------------------------------------------------
  this.on('createFullBinTransfer', async (req) => {
    const { LGNUM, sourceBin, destBin, BESTQ } = req.data;
    const invalid = validateBins(sourceBin, destBin);
    if (invalid) return invalid;
    const stock = await SELECT.from(StockItems).where({ LGNUM, LGPLA: sourceBin });
    if (!stock.length) return error(`La ubicación ${sourceBin} no tiene stock disponible.`, 'sourceBin');
    // >>> INTEGRACIÓN SAP: LT10 / BAPI de creación de OT de traspaso (mov. 999) para TODAS las posiciones de la ubicación origen
    const TANUM = newTANUM();
    await INSERT.into(BinTransferRequests).entries({
      ID: cds.utils.uuid(), LGNUM, sourceBin, destBin, complete: true, BESTQ, status: 'POSTED', resultTANUM: TANUM,
      items: stock.map((s) => ({ ID: cds.utils.uuid(), MATNR: s.MATNR, CHARG: s.CHARG, MENGE: s.VERME, MEINS: s.MEINS }))
    });
    return { success: true, TANUM, messages: [{ severity: 'S', text: `Traspaso completo generado: OT ${TANUM} (${sourceBin} → ${destBin}).` }] };
  });

  // Traspaso PARCIAL ---------------------------------------------------------
  this.on('createPartialBinTransfer', async (req) => {
    const { LGNUM, sourceBin, destBin, BESTQ, items } = req.data;
    const invalid = validateBins(sourceBin, destBin);
    if (invalid) return invalid;
    if (!items?.length) return error('Debe seleccionar al menos un material a trasladar.');
    for (const it of items) {
      const avail = await SELECT.one.from(StockItems).where({ LGNUM, LGPLA: sourceBin, MATNR: it.MATNR, CHARG: it.CHARG || '' });
      if (!avail) return error(`El material ${it.MATNR} (lote ${it.CHARG || '-'}) no está en ${sourceBin}.`, 'MATNR');
      if (!(it.MENGE > 0) || it.MENGE > avail.VERME) {
        return error(`Cantidad ${it.MENGE} de ${it.MATNR} debe estar entre 0 y el disponible (${avail.VERME}) en ${sourceBin}.`, 'MENGE');
      }
    }
    // >>> INTEGRACIÓN SAP: BAPI de creación de OT de traspaso (mov. 999) solo para las posiciones indicadas
    const TANUM = newTANUM();
    await INSERT.into(BinTransferRequests).entries({
      ID: cds.utils.uuid(), LGNUM, sourceBin, destBin, complete: false, BESTQ, status: 'POSTED', resultTANUM: TANUM,
      items: items.map((it) => ({ ID: cds.utils.uuid(), ...it }))
    });
    return { success: true, TANUM, messages: [{ severity: 'S', text: `Traspaso parcial generado: OT ${TANUM} (${items.length} posición(es), ${sourceBin} → ${destBin}).` }] };
  });
});
