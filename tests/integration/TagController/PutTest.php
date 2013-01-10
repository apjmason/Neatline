<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for PUT action in tag API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagControllerTest_Put
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * PUT should update a tag.
     * --------------------------------------------------------------------
     */
    public function testTagUpdate()
    {

        // Create exhibit and tag.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag1');

        // Mock PUT.
        $put = array('tag' => 'tag2');
        foreach (neatline_getStyleCols() as $s) $put[$s] = 1;

        // Issue request.
        $this->writePut($put);
        $this->request->setMethod('PUT');
        $this->dispatch('neatline/tag/'.$tag->id);

        // Reload the tag.
        $tag = $this->_tagsTable->find($tag->id);

        // Check updated fields.
        $this->assertEquals($tag->tag, 'tag2');
        foreach (neatline_getStyleCols() as $s) {
            $this->assertEquals($tag->$s, 1);
        }

    }


    /**
     * --------------------------------------------------------------------
     * When a tag is renamed, the new name should be propagated to the
     * `tags` column on records that include the tag.
     * --------------------------------------------------------------------
     */
    public function testRecordsPropagation()
    {

        // Create exhibit and tag.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag1');

        // Create tagged record.
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag1';
        $record->save();

        // Issue request.
        $this->writePut(array('tag' => 'tag2'));
        $this->request->setMethod('PUT');
        $this->dispatch('neatline/tag/'.$tag->id);

        // Reload the record, check updated tags.
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag2');

    }


}
