namespace mfw.wm.types;

/**
 * Tipos de retorno comunes para las acciones OData que representan
 * contabilizaciones/confirmaciones contra el backend SAP (LE-WM / MM-IM).
 * Sustituyen a las respuestas de los callbacks Movilizer (KEY_*_CALLBACK).
 */
type MessageSeverity : String enum { S = 'S'; I = 'I'; W = 'W'; E = 'E'; }

type Message {
  severity : MessageSeverity;
  text     : String(220);
  field    : String(60);
}

type PostingResult {
  success     : Boolean;
  materialDoc : String(10);  // MBLNR, si aplica
  year        : String(4);   // MJAHR
  messages    : many Message;
}

type ConfirmationResult {
  success   : Boolean;
  TANUM     : String(10);
  TAPOS     : String(4);
  messages  : many Message;
}

type TransferResult {
  success   : Boolean;
  TANUM     : String(10);
  messages  : many Message;
}

type PrintResult {
  success   : Boolean;
  spoolId   : String(10);
  messages  : many Message;
}

// Estructura de entrada usada por acciones que reciben líneas (p.ej. traspaso parcial)
type TransferLineInput {
  MATNR : String(18);
  CHARG : String(10);
  MENGE : Decimal(13,3);
  MEINS : String(3);
}
