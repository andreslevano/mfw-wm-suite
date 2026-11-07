using { mfw.wm as db } from '../db/data-model';
using { mfw.wm.types as types } from './common-types';

/**
 * SalidasService
 * --------------
 * Sustituye a Movelet_SALIDAS.xml. Cubre los 4 sub-flujos identificados:
 *   1) Separación (picking) — CONSOLIDADO (por Nº DT) o ENTREGA (por Nº entrega)
 *   2) Cargue (loading)     — misma dualidad CONSOLIDADO / ENTREGA
 *   3) Contabilizar Salida de Mercancía (PGI) — por Nº DT
 *   4) OTs de Salida — confirmación de picking a nivel de OT/HU
 */
@requires: 'authenticated-user'
service SalidasService @(path: '/odata/v4/salidas') {

  @readonly entity OutboundDocuments as projection on db.OutboundDocuments;

  // OTs pendientes de confirmar en salida, con datos de la posición
  // (TANUM/TAPOS/VLPLA/NLPLA/MATNR/CHARG/GAMNG) como en SCR_SALIDA_TAB_OTS,
  // y las Unidades de Almacén (LENUM) asociadas, como en SCR_SALIDA_OTS_PALES.
  @readonly
  entity PendingOutboundTransferOrders as projection on db.TransferOrderItems {
    *
  } where to_TransferOrder.direction = 'O' and confirmed = false;

  // 1) Separación — por documento de transporte consolidado
  action confirmPickingByTransportDoc(
    TKNUM : String(10),
    items : many types.TransferLineInput
  ) returns types.ConfirmationResult;

  // 1b) Separación — por entrega individual
  action confirmPickingByDelivery(
    VBELN : String(10),
    items : many types.TransferLineInput
  ) returns types.ConfirmationResult;

  // 2) Cargue — por documento de transporte consolidado
  action confirmLoadingByTransportDoc(
    TKNUM : String(10),
    items : many types.TransferLineInput
  ) returns types.ConfirmationResult;

  // 2b) Cargue — por entrega individual
  action confirmLoadingByDelivery(
    VBELN : String(10),
    items : many types.TransferLineInput
  ) returns types.ConfirmationResult;

  // 3) Contabilizar Salida de Mercancía (Post Goods Issue) — mov. 601/641
  action postGoodsIssue(
    TKNUM : String(10)
  ) returns types.PostingResult;

  // 4) Confirmación de OT de salida a nivel de Unidad de Almacén (HU/LENUM)
  action confirmOutboundTransferOrder(
    LGNUM        : String(3),
    TANUM        : String(10),
    TAPOS        : String(4),
    LENUM        : String(20),
    confirmedQty : Decimal(13,3)
  ) returns types.ConfirmationResult;
}
