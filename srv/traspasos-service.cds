using { mfw.wm as db } from '../db/data-model';
using { mfw.wm.types as types } from './common-types';

/**
 * TraspasosService
 * ----------------
 * Sustituye a Movelet_TRASPASOS.xml ("T. DE UBICACIONES / PNC").
 * Flujo: escanear ubicación origen -> Completo o Parcial ->
 * (si parcial: elegir diferenciación de stock + material(es) + cantidad) ->
 * escanear/confirmar ubicación destino -> generar OT de traspaso (mov. 999/311).
 */
@requires: 'authenticated-user'
service TraspasosService @(path: '/odata/v4/traspasos') {

  // Stock disponible en la ubicación origen escaneada — alimenta la
  // pantalla de selección de materiales en un traspaso PARCIAL
  // (SCR_LISTMAT_SCREEN).
  @readonly
  entity BinStock as projection on db.StockItems;

  @readonly entity BinTransferRequests as projection on db.BinTransferRequests;

  // Traspaso COMPLETO: mueve todo el stock de la ubicación origen a la destino.
  action createFullBinTransfer(
    LGNUM     : String(3),
    sourceBin : String(10),
    destBin   : String(10),
    BESTQ     : String(2)   // diferenciación de stock
  ) returns types.TransferResult;

  // Traspaso PARCIAL: mueve solo los materiales/lotes/cantidades indicados.
  action createPartialBinTransfer(
    LGNUM     : String(3),
    sourceBin : String(10),
    destBin   : String(10),
    BESTQ     : String(2),
    items     : many types.TransferLineInput
  ) returns types.TransferResult;
}
