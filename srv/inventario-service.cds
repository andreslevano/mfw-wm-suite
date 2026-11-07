using { mfw.wm as db } from '../db/data-model';

/**
 * InventarioService
 * -----------------
 * Sustituye a Movelet_CONTROL_INVENTARIO_LX03.xml — equivalente funcional
 * de la transacción SAP LX03 "Existencias de almacén por ubicación".
 * Servicio de solo lectura, pensado para filtrar vía OData query options
 * ($filter=LGNUM eq '...' and LGTYP eq '...' and MATNR eq '...')
 * en lugar de la pantalla de criterios SCR_SEL_CRITERIOS.
 */
@readonly
@requires: 'authenticated-user'
service InventarioService @(path: '/odata/v4/inventario') {

  entity StockByBin as projection on db.StockItems;
}
