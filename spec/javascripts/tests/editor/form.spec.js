
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Edit form tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Form', function() {

  var server, records;
  var json = readFixtures('records.json');

  // Get fixtures.
  beforeEach(function() {

    // Load partial, mock server.
    loadFixtures('editor-partial.html');
    server = sinon.fakeServer.create();

    // Run Editor.
    _t.loadEditor();

    // Intercept requests.
    _.each(server.requests, function(r) {
      _t.respond200(r, json);
    });

    // Get record listings.
    records = _t.records.$el.find('.record-row');

  });

  describe('Open/Close', function() {

    var layers, feature1, feature2;

    beforeEach(function() {

      // Get layers.
      layers = _t.getVectorLayers();

      // Get features.
      feature1 = layers[0].features[0];
      feature2 = layers[1].features[0];

    });

    it('should open the form when a record row is clicked', function() {
      $(records[0]).trigger('click');
      expect(_t.records.$el).toContain(_t.form.form);
      expect(_t.records.$el).not.toContain(_t.records.ul);
    });

    it('should close the form when "Close" is clicked', function() {
      $(records[0]).trigger('click');
      $(_t.form.closeButton).trigger('click');
      expect(_t.records.$el).not.toContain(_t.form.form);
      expect(_t.records.$el).toContain(_t.records.ul);
    });

    it('should show the "Text" tab on first form open', function() {

      // Open form.
      $(records[0]).trigger('click');

      // Check for visible "Text."
      expect($('#form-text')).toHaveClass('active');

      // Invisible "Spatial" and "Style."
      expect($('#form-spatial')).not.toHaveClass('active');
      expect($('#form-style')).not.toHaveClass('active');

    });

    it('should show form when a map feature is clicked', function() {

      // Clobber getFeaturesFromEvent().
      layers[0].getFeatureFromEvent = function(evt) { return feature1; };

      // Mock cursor event.
      var evt = {
        xy: new OpenLayers.Pixel(Math.random(), Math.random()),
        type: 'click'
      };

      // Trigger click.
      _t.map.map.events.triggerEvent('click', evt);

      // Check for form.
      expect(_t.records.$el).toContain(_t.form.form);
      expect(_t.records.$el).not.toContain(_t.records.ul);
      expect(_t.form.model.get('title')).toEqual('Record 1');

    });

    it('should not change form records in response to map click', function() {

      // Mock feature1 click.
      layers[0].getFeatureFromEvent = function(evt) { return feature1; };

      // Mock cursor event.
      var evt = {
        xy: new OpenLayers.Pixel(Math.random(), Math.random()),
        type: 'click'
      };

      // Trigger click.
      _t.map.map.events.triggerEvent('click', evt);

      // Check for form.
      expect(_t.records.$el).toContain(_t.form.form);
      expect(_t.records.$el).not.toContain(_t.records.ul);
      expect(_t.form.model.get('title')).toEqual('Record 1');

      // Mock feature2 click.
      layers[0].getFeatureFromEvent = function(evt) { return feature2; };

      // Trigger click.
      _t.map.map.events.triggerEvent('click', evt);

      // Check for unchanged.
      expect(_t.form.model.get('title')).toEqual('Record 1');

    });

    it('should freeze the form model on the map on form open', function() {

      // Get Record 1 layer.
      var layers = _t.getVectorLayers();
      var record1Layer = _.find(layers, function(layer) {
        return layer.name == 'Record 1';
      });

      // By default, no frozen layers.
      expect(_t.map.frozen).toEqual([]);

      // Open form, check for frozen.
      $(records[0]).trigger('click');
      expect(_t.map.frozen).toEqual([record1Layer.nId]);

    });

  });

  describe('Data I/O', function() {

    // Open form.
    beforeEach(function() {
      $(records[0]).trigger('click');
    });

    it('should populate form values', function() {

      // Check for form and values.
      expect(_t.form.head.text()).toEqual('Record 1');
      expect(_t.form.title.val()).toEqual('Record 1');
      expect(_t.form.body.val()).toEqual('Record 1 desc.');
      expect(_t.form.vectorColor.val()).toEqual('#111111');
      expect(_t.form.strokeColor.val()).toEqual('#444444');
      expect(_t.form.selectColor.val()).toEqual('#777777');
      expect(_t.form.vectorOpacity.val()).toEqual('1');
      expect(_t.form.selectOpacity.val()).toEqual('4');
      expect(_t.form.strokeOpacity.val()).toEqual('7');
      expect(_t.form.graphicOpacity.val()).toEqual('10');
      expect(_t.form.strokeWidth.val()).toEqual('13');
      expect(_t.form.pointRadius.val()).toEqual('16');
      expect(_t.form.pointGraphic.val()).toEqual('file1.png');
      expect(_t.form.coverage.val().indexOf('New York')).
        not.toEqual(-1);

    });

    it('should PUT well-formed data on save', function() {

      // Get Boston record.
      var boston = Editor.Modules.Records.collection.models[1];
      var coverage = boston.get('coverage');

      // Enter new data.
      _t.form.title.val('Record 2');
      _t.form.body.val('Record 2 desc.');
      _t.form.vectorColor.val('#222222');
      _t.form.strokeColor.val('#555555');
      _t.form.selectColor.val('#888888');
      _t.form.vectorOpacity.val('2');
      _t.form.selectOpacity.val('5');
      _t.form.strokeOpacity.val('8');
      _t.form.graphicOpacity.val('11');
      _t.form.strokeWidth.val('14');
      _t.form.pointRadius.val('17');
      _t.form.pointGraphic.val('file2.png');
      _t.form.coverage.val(coverage);

      // Click save, capture request.
      _t.form.saveButton.trigger('click');
      var request = _.last(server.requests);
      var params = $.parseJSON(request.requestBody);

      // Check query string.
      expect(request.url).toEqual('/neatline/record/');
      expect(params.title).toEqual('Record 2');
      expect(params.description).toEqual('Record 2 desc.');
      expect(params.vector_color).toEqual('#222222');
      expect(params.stroke_color).toEqual('#555555');
      expect(params.select_color).toEqual('#888888');
      expect(params.vector_opacity).toEqual('2');
      expect(params.select_opacity).toEqual('5');
      expect(params.stroke_opacity).toEqual('8');
      expect(params.graphic_opacity).toEqual('11');
      expect(params.stroke_width).toEqual('14');
      expect(params.point_radius).toEqual('17');
      expect(params.point_image).toEqual('file2.png');
      expect(params.coverage.indexOf('Boston')).not.toEqual(-1);
      expect(params.bounds).toEqual('POLYGON(('+
        '-7910926.6783014 5214839.817002,'+
        '-7910926.6783014 5214839.817002'+
      '))');

    });

  });

  describe('Tabs', function() {

    // Open form.
    beforeEach(function() {
      $(records[0]).trigger('click');
    });

    describe('Spatial', function() {

      it('should select "Navigate" by default', function() {
        var control = $('input[name="mapControls"]:checked').val();
        expect(control).toEqual('pan');
      });

      it('should set draw point mode', function() {

        // Check "Draw Point."
        var point = $('input[name="mapControls"][value="point"]');
        point.attr('checked', 'checked');
        point.trigger('change');

        // Check for control activation.
        expect(_t.map.controls.point.active).toBeTruthy();

      });

      it('should set draw line mode', function() {

        // Check "Draw Line."
        var line = $('input[name="mapControls"][value="line"]');
        line.attr('checked', 'checked');
        line.trigger('change');

        // Check for control activation.
        expect(_t.map.controls.line.active).toBeTruthy();

      });

      it('should set draw polygon mode', function() {

        // Check "Draw Polygon."
        var poly = $('input[name="mapControls"][value="poly"]');
        poly.attr('checked', 'checked');
        poly.trigger('change');

        // Check for control activation.
        expect(_t.map.controls.poly.active).toBeTruthy();

      });

      it('should set draw regular polygon mode', function() {

        // Check "Draw Regular Polygon."
        var reg = $('input[name="mapControls"][value="regPoly"]');
        reg.attr('checked', 'checked');
        reg.trigger('change');

        // Check for control activation.
        expect(_t.map.controls.reg.active).toBeTruthy();

      });

      it('should set modify shape mode', function() {

        // Check "Modify Shape."
        var modify = $('input[name="mapControls"][value="modify"]');
        modify.attr('checked', 'checked');
        modify.trigger('change');

        // Check for control activation.
        expect(_t.map.controls.edit.active).toBeTruthy();

      });

      it('should set delete shape mode', function() {

        // Check "Delete Shape."
        var del = $('input[name="mapControls"][value="delete"]');
        del.attr('checked', 'checked');
        del.trigger('change');

        // Check for control activation.
        expect(_t.map.controls.del.active).toBeTruthy();

      });

      it('should set regular polygon options', function() {

        // Set options.
        _t.form.sides.val('10');
        _t.form.snap.val('45');
        _t.form.irregular.attr('checked', 'checked');
        _t.form.irregular.trigger('change');

        // Check settings.
        expect(_t.map.controls.reg.handler.sides).toEqual(10);
        expect(_t.map.controls.reg.handler.snapAngle).toEqual(45);
        expect(_t.map.controls.reg.handler.irregular).toEqual(true);

      });

      it('should set rotation', function() {

        // Set options.
        var rotate = $('input[name="modifySettings"][value="rotate"]');
        rotate.attr('checked', 'checked');
        rotate.trigger('change');

        // Check settings.
        expect(_t.map.controls.edit.mode).toEqual(
          OpenLayers.Control.ModifyFeature.RESHAPE |
          OpenLayers.Control.ModifyFeature.ROTATE
        );

      });

      it('should set resize', function() {

        // Set options.
        var resize = $('input[name="modifySettings"][value="resize"]');
        resize.attr('checked', 'checked');
        resize.trigger('change');

        // Check settings.
        expect(_t.map.controls.edit.mode).toEqual(
          OpenLayers.Control.ModifyFeature.RESHAPE |
          OpenLayers.Control.ModifyFeature.RESIZE
        );

      });

      it('should set drag', function() {

        // Set options.
        var drag = $('input[name="modifySettings"][value="drag"]');
        drag.attr('checked', 'checked');
        drag.trigger('change');

        // Check settings.
        expect(_t.map.controls.edit.mode).toEqual(
          OpenLayers.Control.ModifyFeature.RESHAPE |
          OpenLayers.Control.ModifyFeature.DRAG
        );

      });

      it('should update "Spatial Data" on point add', function() {

        // Create a new point, trigger modify.
        var pt = new OpenLayers.Geometry.Point(3,4);
        _t.map.controls.point.drawFeature(pt);

        // Check for new data.
        expect(_t.form.coverage.val().indexOf('3,4')).
          not.toEqual(-1);

      });

      it('should update "Spatial Data" on line add', function() {

        // Create a new point, trigger modify.
        var pt1 = new OpenLayers.Geometry.Point(1,2);
        var pt2 = new OpenLayers.Geometry.Point(3,4);
        var line = new OpenLayers.Geometry.LineString(pt1,pt2);
        _t.map.controls.line.drawFeature(line);

        // Check for new data.
        expect(_t.form.coverage.val().indexOf('1,2')).
          not.toEqual(-1);
        expect(_t.form.coverage.val().indexOf('3,4')).
          not.toEqual(-1);

      });

      it('should update "Spatial Data" on polygon add', function() {

        // Create a new point, trigger modify.
        var pt1 = new OpenLayers.Geometry.Point(1,2);
        var pt2 = new OpenLayers.Geometry.Point(3,4);
        var pt3 = new OpenLayers.Geometry.Point(5,6);
        var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
        var poly = new OpenLayers.Geometry.Polygon([ring]);
        _t.map.controls.poly.drawFeature(poly);

        // Check for new data.
        expect(_t.form.coverage.val().indexOf('1,2')).
          not.toEqual(-1);
        expect(_t.form.coverage.val().indexOf('3,4')).
          not.toEqual(-1);
        expect(_t.form.coverage.val().indexOf('5,6')).
          not.toEqual(-1);

      });

      it('should update "Spatial Data" on regular polygon add', function() {

        // Create a new point, trigger modify.
        var pt1 = new OpenLayers.Geometry.Point(1,2);
        var pt2 = new OpenLayers.Geometry.Point(3,4);
        var pt3 = new OpenLayers.Geometry.Point(5,6);
        var ring = new OpenLayers.Geometry.LinearRing([pt1,pt2,pt3]);
        var poly = new OpenLayers.Geometry.Polygon([ring]);
        _t.map.controls.reg.drawFeature(poly);

        // Check for new data.
        expect(_t.form.coverage.val().indexOf('1,2')).
          not.toEqual(-1);
        expect(_t.form.coverage.val().indexOf('3,4')).
          not.toEqual(-1);
        expect(_t.form.coverage.val().indexOf('5,6')).
          not.toEqual(-1);

      });

      it('should update "Spatial Data" on feature edit', function() {

        // Edit feature, set new point coords.
        var feature = _t.map.editLayer.features[0];
        _t.map.controls.edit.feature = feature;
        feature.geometry.x = 1;
        feature.geometry.y = 2;

        // Trigger modification.
        _t.map.controls.edit.dragComplete();
        expect(_t.form.coverage.val().indexOf('1,2')).
          not.toEqual(-1);

      });

      it('should update "Spatial Data" on feature delete', function() {

        // Edit feature, set new point coords.
        var feature = _t.map.editLayer.features[0];

        // Trigger modification.
        _t.map.controls.del.selectFeature(feature);
        expect(_t.form.coverage.val().indexOf('<Point>')).toEqual(-1);

      });

    });

  });

});
