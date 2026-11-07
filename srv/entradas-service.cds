using { mfw.wm as db } from '../db/data-model';
using { mfw.wm.types as types } from './common-types';

/**
 * EntradasService
 * ---------------
 * Sustituye a Movelet_ENTRADAS.xml. Cubre los 5 sub-flujos identificados
 * en el Movelet original:
 *   1) Producción            -> postProductionGoodsReceipt
 *   2) Maquila/Comercializados (por pedido) -> postPurchaseOrderGoodsReceipt
 *   3) Entrada por Entrega    -> postDeliveryGoodsReceipt
 *   4) Entrada por Devolución -> postReturnGoodsReceipt
 *   5) OTs de Entrada (ubicación/put-away) -> confirmInboundTransferOrder
 */
@requires: 'authenticated-user'
service EntradasService @(path: '/odata/v4/entradas') {

  // --- Consulta / selección (pantallas SCR_SCAN_* y SCR_DETAIL_PEDIDO_*) ---

  @readonly entity ProductionOrders   as projection on db.ProductionOrders;
  @readonly entity PurchaseOrders     as projection on db.PurchaseOrders;
  @readonly entity InboundDeliveries  as projection on db.InboundDeliveries;
  @readonly entity ReturnDeliveries   as projection on db.ReturnDeliveries;

  // OTs pendientes de confirmar en entrada (put-away), filtrable por
  // Unidad de Almacén (LENUM) escaneada, como en KEY_SCR_OTS_FORM.
  @readonly
  entity PendingInboundTransferOrders as projection on db.TransferOrderItems {
    *
  } where to_TransferOrder.direction = 'I' and confirmed = false;

  // --- Acciones de negocio (contabilizaciones) ---

  // 1) Producción: GR contra orden de fabricación (MIGO mov. 101/AUFNR)
  action postProductionGoodsReceipt(
    AUFNR : String(12),
    MENGE : Decimal(13,3),
    MEINS : String(3)
  ) returns types.PostingResult;

  // 2) Maquila / Comercializados: GR contra pedido (MIGO mov. 101/EBELN)
  action postPurchaseOrderGoodsReceipt(
    EBELN : String(10),
    EBELP : String(5),
    MATNR : String(18),
    CHARG : String(10),
    MENGE : Decimal(13,3),
    MEINS : String(3)
  ) returns types.PostingResult;

  // 3) Entrada por Entrega (referida a STO / traslado con Nº de entrega + Nº DT)
  action postDeliveryGoodsReceipt(
    VBELN : String(10),
    TKNUM : String(10),
    items : many types.TransferLineInput
  ) returns types.PostingResult;

  // 4) Entrada por Devolución (mov. 651)
  action postReturnGoodsReceipt(
    VBELN : String(10),
    EBELN : String(10),
    KUNNR : String(10),
    items : many types.TransferLineInput
  ) returns types.PostingResult;

  // 5) Confirmación de OT de entrada (put-away) tras escanear la unidad
  //    de almacén (LENUM) — pantalla KEY_SCR_OTS_FORM / SCR_ENTRA_TAB_OTS
  action confirmInboundTransferOrder(
    LGNUM : String(3),
    TANUM : String(10),
    TAPOS : String(4),
    LENUM : String(20),
    NLPLA : String(10)   // ubicación destino confirmada (puede diferir de la propuesta)
  ) returns types.ConfirmationResult;
}
