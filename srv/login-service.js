const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Warehouses } = this.entities;

  this.on('getUserContext', async (req) => {
    // TODO (integración real): resolver LGNUM/almacenes autorizados a partir
    // del usuario autenticado (req.user) contra el backend SAP, p.ej. leyendo
    // parámetros de usuario (SU3, parámetro 'LGN') vía RFC_READ_TABLE/BAPI o
    // una tabla de mapeo de autorizaciones replicada localmente.
    const user = req.user?.id || 'ANONYMOUS';
    const wh = await SELECT.one.from(Warehouses);

    return {
      userName: user,
      LGNUM: wh?.LGNUM || '100',
      warehouseDesc: wh?.description || 'Almacén Central',
      allowedApps: ['ENTRADAS', 'SALIDAS', 'TRASPASOS', 'INVENTARIO', 'UTILIDADES'],
    };
  });
});
