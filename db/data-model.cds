namespace mfw.wm;

using { managed, cuid } from '@sap/cds/common';

/**
 * ============================================================================
 *  MODELO DE DATOS MAESTROS Y DE MOVIMIENTO — SUITE WM
 *  Origen funcional: reingeniería de los Movelets Movilizer
 *  (LOGIN, ENTRADAS, SALIDAS, TRASPASOS, CONTROL_INVENTARIO_LX03, UTILIDADES)
 *  sobre SAP LE-WM (Gestión de Almacenes clásica).
 *
 *  Estas entidades representan la vista de negocio que la capa OData expone.
 *  En un escenario productivo, la mayoría se implementan como "entidades
 *  remotas/virtuales" (CAP Remote Services) que delegan en RFC/BAPI hacia
 *  el sistema SAP backend (ver srv/*.cds y el documento de arquitectura).
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// 1. DATOS MAESTROS (Warehouse / Material / Bin)
// ---------------------------------------------------------------------------

entity Warehouses {
  key LGNUM       : String(3)   @title: 'Número de almacén';
      description  : String(40) @title: 'Descripción';
      storageTypes : Association to many StorageTypes on storageTypes.LGNUM = $self.LGNUM;
}

entity StorageTypes {
  key LGNUM       : String(3);
  key LGTYP       : String(3)   @title: 'Tipo de almacén';
      description  : String(40);
}

entity StorageBins {
  key LGNUM       : String(3);
  key LGTYP       : String(3);
  key LGPLA       : String(10)  @title: 'Ubicación';
      binType      : String(10);
}

entity Materials {
  key MATNR       : String(18)  @title: 'Material';
      MAKTX        : String(40) @title: 'Descripción de material';
      MEINS        : String(3)  @title: 'Unidad de medida base';
}

entity PrintDevices {
  key TDDEST      : String(4)   @title: 'Dispositivo de salida';
      description  : String(40);
      LGNUM        : String(3);
      WERKS        : String(4)  @title: 'Centro';
}

// ---------------------------------------------------------------------------
// 2. STOCK / QUANTS — equivalente funcional a LX03 (solo lectura)
//    Reemplaza a Movelet_CONTROL_INVENTARIO_LX03.xml
// ---------------------------------------------------------------------------

@readonly
entity StockItems {
  key LGNUM   : String(3)   @title: 'Número de almacén';
  key LGTYP   : String(3)   @title: 'Tipo de almacén';
  key LGPLA   : String(10)  @title: 'Ubicación';
  key MATNR   : String(18)  @title: 'Material';
  key CHARG   : String(10)  @title: 'Lote';
  key LENUM   : String(20)  @title: 'Unidad de almacén (HU)';
      MAKTX   : String(40)  @title: 'Descripción de material';
      BESTQ   : String(2)   @title: 'Diferenciación de stock';
      SOBKZ   : String(1)   @title: 'Indicador de stock especial';
      VERME   : Decimal(13,3) @title: 'Stock disponible';
      EINME   : Decimal(13,3) @title: 'Stock a entrar';
      AUSME   : Decimal(13,3) @title: 'Stock de salida';
      GESME   : Decimal(13,3) @title: 'Stock total';
      MEINS   : String(3)   @title: 'UM';
}

// ---------------------------------------------------------------------------
// 3. ÓRDENES DE TRANSPORTE (OT) — LTAK/LTAP — usadas por ENTRADAS, SALIDAS
//    y como resultado de TRASPASOS
// ---------------------------------------------------------------------------

entity TransferOrders {
  key LGNUM       : String(3);
  key TANUM       : String(10)  @title: 'Nº de orden de transporte (OT)';
      TYPMV        : String(3)  @title: 'Tipo de movimiento (Bewegungsart)';
      @title: 'Entrada/Salida'
      direction    : String(1)  enum { I = 'I'; O = 'O'; };
      status       : String(10) enum { OPEN; PARTIAL; CONFIRMED; CANCELLED; } default 'OPEN';
      refDocType   : String(10) @title: 'Tipo de documento de referencia (AUFNR/EBELN/VBELN/TKNUM)';
      refDoc       : String(20) @title: 'Documento de referencia';
      AGRPD        : String(10) @title: 'Agrupador de picking';
      createdAt    : Timestamp;
      items        : Composition of many TransferOrderItems on items.TANUM = $self.TANUM
                                                             and items.LGNUM = $self.LGNUM;
}

entity TransferOrderItems {
  key LGNUM   : String(3);
  key TANUM   : String(10);
  key TAPOS   : String(4)   @title: 'Posición de OT';
      MATNR   : String(18)  @title: 'Material';
      MAKTX   : String(40)  @title: 'Descripción';
      CHARG   : String(10)  @title: 'Lote';
      GAMNG   : Decimal(13,3) @title: 'Cantidad planificada';
      VERME   : Decimal(13,3) @title: 'Cantidad confirmada';
      MEINS   : String(3)   @title: 'UM';
      VLPLA   : String(10)  @title: 'Ubicación origen';
      NLPLA   : String(10)  @title: 'Ubicación destino';
      LENUM   : String(20)  @title: 'Unidad de almacén (HU)';
      TYPMV   : String(3)   @title: 'Tipo de movimiento';
      confirmed : Boolean default false;
      to_TransferOrder : Association to TransferOrders on to_TransferOrder.TANUM = TANUM
                                                        and to_TransferOrder.LGNUM = LGNUM;
}

// ---------------------------------------------------------------------------
// 4. ENTRADAS — Producción / Maquila-Comercializados / Entrega / Devoluciones
// ---------------------------------------------------------------------------

entity ProductionOrders {
  key AUFNR     : String(12)  @title: 'Nº de orden';
      MATNR     : String(18)  @title: 'Material';
      MAKTX     : String(40)  @title: 'Descripción de material';
      GAMNG     : Decimal(13,3) @title: 'Cantidad total a ingresar';
      GWEMG     : Decimal(13,3) @title: 'Cantidad ya ingresada';
      MENGE_MAX : Decimal(13,3) @title: 'Cantidad máxima por estiba';
      ERDAT     : Date        @title: 'Fecha de ingreso';
      MEINS     : String(3)   @title: 'Unidad de medida';
}

entity PurchaseOrders {
  key EBELN   : String(10)  @title: 'Nº de pedido';
      BSART   : String(4)   @title: 'Tipo de pedido';
      items    : Composition of many PurchaseOrderItems on items.EBELN = $self.EBELN;
}

entity PurchaseOrderItems {
  key EBELN   : String(10);
  key EBELP   : String(5)   @title: 'Posición';
      MATNR   : String(18)  @title: 'Material';
      MAKTX   : String(40)  @title: 'Descripción';
      AEDAT   : Date        @title: 'Fecha de fabricación';
      CHARG   : String(10)  @title: 'Lote';
      MENGE   : Decimal(13,3) @title: 'Cantidad';
      MEINS   : String(3)   @title: 'UM';
}

entity InboundDeliveries {
  key VBELN   : String(10)  @title: 'Nº de entrega';
      EBELN   : String(10)  @title: 'Nº de pedido';
      BSART   : String(4)   @title: 'Tipo de pedido';
      TKNUM   : String(10)  @title: 'Nº de documento de transporte';
      items    : Composition of many InboundDeliveryItems on items.VBELN = $self.VBELN;
}

entity InboundDeliveryItems {
  key VBELN   : String(10);
  key POSNR   : String(6)   @title: 'Posición';
      MATNR   : String(18)  @title: 'Material';
      MAKTX   : String(40)  @title: 'Descripción';
      CHARG   : String(10)  @title: 'Lote';
      LFIMG   : Decimal(13,3) @title: 'Cantidad de entrega';
      MEINS   : String(3)   @title: 'UM';
}

entity ReturnDeliveries {
  key VBELN   : String(10)  @title: 'Nº de entrega de devolución';
      EBELN   : String(10)  @title: 'Nº de pedido';
      BSART   : String(4)   @title: 'Tipo de pedido';
      KUNNR   : String(10)  @title: 'Cliente';
      items    : Composition of many ReturnDeliveryItems on items.VBELN = $self.VBELN;
}

entity ReturnDeliveryItems {
  key VBELN   : String(10);
  key POSNR   : String(6);
      MATNR   : String(18);
      MAKTX   : String(40);
      CHARG   : String(10);
      LFIMG   : Decimal(13,3);
      MEINS   : String(3);
}

// ---------------------------------------------------------------------------
// 5. SALIDAS — Documentos de transporte / entregas de salida
// ---------------------------------------------------------------------------

entity OutboundDocuments {
  key TKNUM   : String(10)  @title: 'Nº de documento de transporte (DT)';
      VBELN   : String(10)  @title: 'Nº de entrega';
      @title: 'Tipo (Consolidado/Entrega)'
      docKind : String(12)  enum { CONSOLIDATED = 'CONSOLIDATED'; DELIVERY = 'DELIVERY'; };
      pickStatus : String(10) enum { OPEN; PICKED; LOADED; PGI_DONE; } default 'OPEN';
}

// ---------------------------------------------------------------------------
// 6. TRASPASOS (bin-to-bin) — resultado también materializado como TransferOrder
// ---------------------------------------------------------------------------

entity BinTransferRequests : managed {
  key ID          : UUID;
      LGNUM       : String(3);
      sourceBin   : String(10) @title: 'Ubicación origen';
      destBin     : String(10) @title: 'Ubicación destino';
      complete    : Boolean    @title: 'Traspaso completo (true) / parcial (false)';
      BESTQ       : String(2)  @title: 'Diferenciación de stock';
      status      : String(10) enum { CREATED; POSTED; ERROR; } default 'CREATED';
      resultTANUM : String(10) @title: 'OT generada';
      items        : Composition of many BinTransferItems on items.request_ID = $self.ID;
}

entity BinTransferItems {
  key ID          : UUID;
      request_ID  : UUID;
      MATNR       : String(18);
      CHARG       : String(10);
      MENGE       : Decimal(13,3) @title: 'Cantidad a trasladar';
      MEINS       : String(3);
      request      : Association to BinTransferRequests on request.ID = request_ID;
}
