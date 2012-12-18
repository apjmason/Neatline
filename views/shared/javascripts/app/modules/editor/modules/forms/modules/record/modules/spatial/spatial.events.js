
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form "Spatial" tab events.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Record.Spatial', function(
  Spatial, Record, Backbone, Marionette, $, _) {


  /**
   * Get input markup when the form is initialized.
   *
   * @param {Object|DOMElement} form: The form element.
   */
  Neatline.vent.on('editor:form:initialize', function(form) {
    Spatial.view.getElements(form);
  });


  /**
   * Render element values when the form is opened.
   *
   * @param {Object} model: The record model.
   */
  Neatline.vent.on('editor:form:open', function(model) {
    Spatial.view.render(model);
  });


  /**
   * Before the form is saved, broadcast the tab's data hash to be added
   * to the aggregated hash on the form view.
   */
  Neatline.vent.on('editor:form:getData', function() {
    Neatline.vent.trigger('editor:form:addData',
      Spatial.view.gather()
    );
  });


});