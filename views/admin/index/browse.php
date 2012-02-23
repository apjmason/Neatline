<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Main portal view for Neatline.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php
head(array('content_class' => 'neatline'));
?>

<?php echo $this->partial('index/_header.php', array(
    'subtitle' => 'Browse Exhibits',
    'add_button_uri' => 'neatline-exhibits/add',
    'add_button_text' => 'Create an Exhibit'
)); ?>

<div id="primary">

<?php echo flash(); ?>

<?php if(count($neatlines) > 0): ?>

<table class="neatline">

    <thead>
        <tr>
        <!-- Column headings. -->
        <?php browse_headings(array(
            'Exhibit' => 'name',
            'Modified' => 'modified',
            '# Items' => 'added',
            'Public' => 'public'
        )); ?>
        </tr>
    </thead>

    <tbody>
        <!-- Exhibit listings. -->
        <?php foreach ($neatlines as $neatline): ?>
        <tr exhibitid="<?php echo $neatline->id; ?>">
            <td class="title"><?php echo neatline_linkToNeatline($neatline); ?>
                <?php echo $this->partial('index/_action_buttons.php', array(
                  'uriSlug' => 'neatline-exhibits',
                  'neatline' => $neatline)); ?>
            </td>
            <td class="map"><?php echo neatline_linkToMap($neatline); ?></td>
            <td class="added"><?php echo neatline_formatDate($neatline->added); ?></td>
            <td></td>
        </tr>
        <?php endforeach; ?>
    </tbody>

</table>

<!-- Pagination. -->
<?php if ($pagination['total_results'] > $pagination['per_page']): ?>
    <div class="neatline-pagination">
        <?php echo pagination_links(array('scrolling_style' => 'All',
        'page_range' => '5',
        'partial_file' => 'index/_pagination.php',
        'page' => $pagination['current_page'],
        'per_page' => $pagination['per_page'],
        'total_results' => $pagination['total_results'])); ?>
    </div>
<?php endif; ?>

<?php else: ?>

    <p class="neatline-alert">There are no Neatline exhibits yet.
    <a href="<?php echo uri('neatline-exhibits/add'); ?>">Create one!</a></p>

<?php endif; ?>

</div>

<?php
foot();
?>
