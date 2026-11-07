using { mfw.wm as db } from '../db/data-model';
using { mfw.wm.types as types } from './common-types';

/**
 * UtilidadesService
 * -----------------
 * Sustituye a Movelet_UTILIDADES.xml ("Impresión de Etiquetas").
 * Movelet_CFGSET_CUSTOMIZING.xml (configuración de iconografía del
 * cliente Movilizer) no se traduce a un servicio de negocio: pasa a ser
 * configuración estática de la app (branding/manifest), no una API.
 */
@requires: 'authenticated-user'
service UtilidadesService @(path: '/odata/v4/utilidades') {

  @readonly entity PrintDevices as projection on db.PrintDevices;

  action printLabel(
    LGNUM  : String(3),
    WERKS  : String(4),
    LENUM  : String(20),
    LGPLA  : String(10),
    TDDEST : String(4)
  ) returns types.PrintResult;
}
