
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

// TODO|dev
jQuery(function($) {

  var form = $('form.import');

  $('input[type="submit"]').click(function(e) {
    console.log(form.serializeArray());
    e.preventDefault();
  });

});