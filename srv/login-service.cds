using { mfw.wm as db } from '../db/data-model';
using { mfw.wm.types as types } from './common-types';

/**
 * LoginService
 * ------------
 * Sustituye a Movelet_MOVELET_LOGIN.xml.
 *
 * En el escenario objetivo la autenticación de usuario/contraseña YA NO
 * viaja como payload de negocio: se delega en el proveedor de identidad
 * corporativo (SAML2/OAuth2 vía SAP BTP XSUAA, o Basic/SSO contra el
 * SAP Gateway on-premise). Este servicio conserva únicamente la lógica
 * de negocio que el Movelet resolvía tras el login: determinar el
 * almacén (LGNUM) y el "tipo de almacén" con el que trabajará el
 * usuario, a partir de su usuario técnico.
 */
@requires: 'authenticated-user'
service LoginService @(path: '/odata/v4/login') {

  @readonly
  entity Warehouses as projection on db.Warehouses;

  // Sustituye al campo "Tipo de almacén" (LGORT) capturado manualmente
  // en KEY_LOGIN_CUI2. Se resuelve por autorización de usuario (rol PFCG /
  // parámetro de usuario) en vez de digitarse.
  function getUserContext() returns {
    userName      : String;
    LGNUM         : String;
    warehouseDesc : String;
    allowedApps   : many String; // p.ej. ['ENTRADAS','SALIDAS','TRASPASOS','INVENTARIO','UTILIDADES']
  };
}
