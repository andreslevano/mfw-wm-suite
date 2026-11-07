const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { PrintDevices } = this.entities;

  this.on('printLabel', async (req) => {
    const { LGNUM, WERKS, LENUM, LGPLA, TDDEST } = req.data;
    if (!TDDEST) {
      return { success: false, messages: [{ severity: 'E', text: 'El dispositivo de salida es obligatorio.', field: 'TDDEST' }] };
    }
    if (!LENUM && !LGPLA) {
      return { success: false, messages: [{ severity: 'E', text: 'Indique Unidad de Almacén o Ubicación a imprimir.' }] };
    }
    const device = await SELECT.one.from(PrintDevices).where({ TDDEST });
    if (!device) {
      return { success: false, messages: [{ severity: 'E', text: `Dispositivo de salida ${TDDEST} no encontrado.`, field: 'TDDEST' }] };
    }
    // >>> INTEGRACIÓN SAP: llamada a Smart Form / SAPscript vía función de
    // impresión remota (RFC 'SSF_FUNCTION_MODULE_NAME' + módulo generado),
    // o a un microservicio de impresión de etiquetas (ZPL) si la impresora
    // es de red (Zebra/Honeywell) en vez de spool SAP.
    const spoolId = String(Math.floor(100000 + Math.random() * 899999));
    return { success: true, spoolId, messages: [{ severity: 'S', text: `Etiqueta enviada al dispositivo ${TDDEST} (spool ${spoolId}).` }] };
  });
});
