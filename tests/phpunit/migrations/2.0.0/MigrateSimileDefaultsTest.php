<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_MigrateSimileDefaults
    extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('MigrateSimileDefaults.exhibits.json');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If the timeline was not enabled on the old exhibit, an expansion
     * should not be created.
     */
    public function testNotCreateExpansionWhenTimelineInactive()
    {
        $this->assertFalse($this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('No Timeline')
        ));
    }


    /**
     * If the timeline was enabled on an old exhibit, a SIMILE expansion
     * row should be created for the new exhibit.
     */
    public function testCreateExpansionWhenTimelineActive()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline Zoom')
        );

        $this->assertEquals($expansion->simile_default_date,    '2000');
        $this->assertEquals($expansion->simile_tape_height,     10);
        $this->assertEquals($expansion->simile_track_height,    30);

    }


    /**
     * If the old `default_timeline_zoom` field is non-null, set the new
     * `simile_interval_unit` and `simile_interval_pixels` fields with the
     * values that correspond to the old zoom index.
     */
    public function testMigrateExistingZoom()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline Zoom')
        );

        $this->assertEquals($expansion->simile_interval_unit,   'HOUR');
        $this->assertEquals($expansion->simile_interval_pixels, 300);

    }


    /**
     * If `default_timeline_zoom` field is null, set default values on the
     * new expansion row.
     */
    public function testSetDefaultZoom()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline No Zoom')
        );

        $this->assertEquals($expansion->simile_interval_unit,   'YEAR');
        $this->assertEquals($expansion->simile_interval_pixels, 100);

    }


}