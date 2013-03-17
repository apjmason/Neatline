<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit widget tabs.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php if (_nl_hasExhibitWidgets(_nl_exhibit())): ?>
  <li class="dropdown plugins">

    <!-- Dropdown. -->
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
      Plugins <b class="caret"></b>
    </a>

    <ul class="dropdown-menu">
      <?php foreach (_nl_getExhibitWidgets(_nl_exhibit())
        as $label => $widget): ?>

        <!-- Tabs. -->
        <li class="tab">
          <a
            data-slug="<?php echo $widget['slug']; ?>"
            href="#<?php echo $widget['slug']; ?>"
          ><?php echo $label; ?></a>
        </li>

      <?php endforeach; ?>
    </ul>

  </li>
<?php endif; ?>