
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * WMS layer constructor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map.Layers.WMS', function(
  WMS, Neatline, Backbone, Marionette, $, _) {


  /**
   * Construct a WMS layer.
   *
   * @param {Object} json: The layer definition.
   * @return {OpenLayers.Layer.WMS}: The WMS layer.
   */
  Neatline.reqres.setHandler('LAYERS:WMS', function(json) {
    return new OpenLayers.Layer.WMS(
      json.title,
      json.properties.address,
      {
        layers: json.properties.layers
      }
    );
  });


});