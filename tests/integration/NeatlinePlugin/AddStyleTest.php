<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for NeatlinePlugin::addStyle.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlinePluginTest_AddStyle
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * addStyle() should add columns to the records table.
     * --------------------------------------------------------------------
     */
    public function testAddStyle()
    {

        // Register a style.
        NeatlinePlugin::addStyle('test', 'INT UNSIGNED NULL');

        // Get columns.
        $recordCols = $this->db->describeTable(
            $this->_recordsTable->getTableName()
        );

        // Check for record column.
        $this->assertArrayHasKey('test', $recordCols);
        $this->assertEquals($recordCols['test']['DATA_TYPE'], 'int');

    }


}
