/**
 * Testing helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


_t = {};


// --------------------
// Application loaders.
// --------------------

/*
 * Load neatline application.
 */
_t.loadNeatline = function() {

  // Restart components.
  Neatline.Controllers.Exhibit.init();
  Neatline.Controllers.Map.init();

  // Shortcut components
  _t.map = Neatline.Controllers.Map.Map;

};


// --------
// Helpers.
// --------

/*
 * Get vector layers on the map.
 */
_t.getVectorLayers = function() {

  // Filter for features.length > 0.
  return _t.map.map.getLayersBy('features', {
    test: function(prop) {
      return !_.isUndefined(prop) && prop.length > 0;
    }
  });

};
