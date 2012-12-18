
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Form view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Forms.Record.Views', function(
  Views, Record, Backbone, Marionette, $, _) {


  Views.RecordForm = Backbone.View.extend({


    options: {
      messages: {
        save: 'The record was saved successfully!',
        remove: 'The record was deleted successfully!'
      }
    },


    getTemplate: function() {
      return _.template($('#record-form').html());
    },


    /**
     * Render the form template, initialize trackers, get element markup.
     */
    initialize: function() {

      // Trackers:
      this.model    = null;   // The model currently bound to the form.
      this.hash     = null;   // The hash of the currently selected tab.
      this.started  = false;  // True if the form has been displayed.
      this.open     = false;  // True if the form is currently open.
      this.data     = {};     // Aggregate data gathered from tabs.

      // Render template.
      this.form = $(this.getTemplate()());

      // Markup:
      this.closeButton =    this.form.find('button.close');
      this.deleteButton =   this.form.find('a[name="delete"]');
      this.confirmButton =  this.form.find('button[name="delete"]');
      this.saveButton =     this.form.find('a[name="save"]');
      this.deleteModal =    this.form.find('#deleteConfirm');
      this.lead =           this.form.find('p.lead');
      this.tabs =           this.form.find('ul.nav a');

      // Bind input listeners.
      Neatline.vent.trigger('editor:form:initialize', this.form);
      this.bindEvents();

    },


    /**
     * Bind event listeners to form elements.
     */
    bindEvents: function() {

      // Tabs:
      this.tabs.on('shown', _.bind(function(e) {

        // Publish "Spatial" (de)selection.
        var event = (e.target.hash == '#form-spatial') ?
          'editor:form:spatialSelect' :
          'editor:form:spatialDeselect';
        Neatline.vent.trigger(event);

        // Store the hash.
        this.hash = e.target.hash;

      }, this));

      // Close button:
      this.closeButton.click(_.bind(function(e) {
        e.preventDefault();
        this.close();
      }, this));

      // Save button:
      this.saveButton.click(_.bind(function(e) {
        console.log('save');
        e.preventDefault();
        this.save();
      }, this));

      // Delete button:
      this.confirmButton.click(_.bind(function(e) {
        e.preventDefault();
        this.remove();
      }, this));

    },


    /**
     * Show the form; block if the form is already open.
     *
     * @param {Object} model: The record model.
     * @param {Boolean} focus: If true, focus the map on the edit layer.
     */
    show: function(model, focus) {

      // Break if open.
      if (this.open) return;

      // Render.
      this.model = model;
      this.render();

      // Publish, set trackers.
      Neatline.vent.trigger('editor:form:open', model, focus);
      this.open = true;

    },


    /**
     * Render the form header, set the starting tab.
     */
    render: function() {

      // Do first-open routine, set header.
      if (!this.started) this.setStarted();
      this.lead.text(this.model.get('title'));

      // Disable bubble if "Spatial" is active.
      if (this.hash == '#form-spatial') {
        Neatline.vent.trigger('editor:form:spatialSelect');
      }

      this.$el.html(this.form);
      return this;

    },


    /**
     * Close the form, publish the event, set the global tracker.
     */
    close: function() {
      Neatline.vent.trigger('editor:form:close', this.model);
      this.form.hide();
      this.model = null;
      this.open = false;
    },


    /**
     * Save the current form values.
     */
    save: function() {

      // Set button.
      this.setSaving();

      // Gather data from tab views.
      Neatline.vent.trigger('editor:form:getData');

      // PUT:
      this.model.save(this.data, {
        success: _.bind(function() {
          this.updateHead();
          this.setSaved();
        }, this)
      });

      // Clear data.
      this.data = {};

    },


    /**
     * Destroy the model, close the form.
     */
    remove: function() {

      // DELETE:
      this.model.destroy({
        success: _.bind(function() {

          // Notify collections to purge the model.
          Neatline.vent.trigger('editor:form:delete', this.model);

          // Close the modal and form.
          this.deleteModal.modal('hide');
          this.close();

          // Flash notification.
          this.notify(this.options.messages.remove);

        }, this)
      });

    },


    /**
     * Flash a notification.
     *
     * @param {String} text: The notification content.
     */
    notify: function(text) {
      noty({ text: text, layout: 'topCenter', timeout: 500 });
    },


    /**
     * Activate "Text" as the starting tab selection.
     */
    setStarted: function() {
      $(this.tabs[0]).tab('show');
      this.started = true;
    },


    /**
     * Render the record title at the top of the form.
     */
    updateHead: function() {
      this.lead.text(this.model.get('title'));
    },


    /**
     * Return the saved button to its default state, notify.
     */
    setSaved: function() {
      this.notify(this.options.messages.save);
      this.saveButton.text('Save');
    },


    /**
     * Set the saved button to "Saving.." mode.
     */
    setSaving: function() {
      this.saveButton.text('Saving');
    }


  });


});