<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Admin controller.
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

class Neatline_IndexController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        $modelName = 'NeatlineExhibit';
        if (version_compare(OMEKA_VERSION, '2.0-dev', '>=')) {
            $this->_helper->db->setDefaultModelName($modelName);
        } else {
            $this->_modelClass = $modelName;
        }

        $this->_browseRecordsPerPage = get_option('per_page_admin');

        try {
            $this->_table = $this->getTable($modelName);
            $this->aclResource = $this->findById();
        } catch (Omeka_Controller_Exception_404 $e) {}

        $this->_recordsTable = $this->getTable('NeatlineDataRecord');

    }

    /**
     * Create a new exhibit.
     *
     * @return void
     */
    public function addAction()
    {
        $neatline = new NeatlineExhibit;
        $form = $this->_getNeatlineDetailsForm($neatline);
        $this->view->form = $form;

        if ($this->_request->isPost()) {

            // Validate form.
            if ($form->isValid($_POST)) {

                // Save and redirect.
                $neatline->saveForm($form->getValues());
                $successMessage = $this->_getAddSuccessMessage($neatline);
                $this->flashSuccess($successMessage);
                $this->_redirect('neatline-exhibits');

            }

            else {
                $this->flashError('There were problems with your form.');
            }

        }

    }

    /**
     * Edit an exhibit.
     *
     * @return void
     */
    public function editAction()
    {

        // Get the exhibit.
        $neatline = $this->findById();
        $form = $this->_getNeatlineDetailsForm($neatline);

        if ($this->_request->isPost()) {

            // Validate the form.
            if ($form->isValid($this->_request->getPost())) {

                // Save and redirect.
                $neatline->saveForm($form->getValues());
                $successMessage = $this->_getEditSuccessMessage($neatline);
                $this->flashSuccess($successMessage);
                $this->_redirect('neatline-exhibits');

            }

            else {
                $this->flashError('There were problems with your form.');
            }

        }

        // Push exhibit and form.
        $this->view->neatlineexhibit = $neatline;
        $this->view->form = $form;

    }

    /**
     * Edit items query.
     *
     * @return void
     */
    public function queryAction()
    {

        // Get the exhibit.
        $neatline = $this->findById();

        // Save query.
        if(isset($_GET['search'])) {
            $neatline->query = serialize($_GET);
            $neatline->save();
            $this->redirect->goto('browse');
        } else {
            $queryArray = unserialize($neatline->query);
            $_GET = $queryArray;
            $_REQUEST = $queryArray;
        }

        $this->view->neatlineexhibit = $neatline;

    }

    public function showAction()
    {
        $neatline = $this->getTable('NeatlineExhibit')->findBySlug($this->_request->getParam('slug'));
        $this->view->neatlineexhibit = $neatline;
    }

    /**
     * ~ AJAX ~
     * Get events JSON for the timeline.
     *
     * @return JSON The events array.
     */
    public function simileAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the exhibit.
        $neatline = $this->findById();

        // Output the JSON string.
        echo $this->_recordsTable->buildTimelineJson($neatline);

    }

    /**
     * ~ AJAX ~
     * Get item-wkt JSON for the map.
     *
     * @return JSON The vector data.
     */
    public function openlayersAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the exhibit.
        $neatline = $this->findById();

        // Output the JSON string.
        echo $this->_recordsTable->buildMapJson($neatline);

    }

    /**
     * ~ AJAX ~
     * Get item list markup for the undated items block.
     *
     * @return HTML The items.
     */
    public function udiAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the exhibit.
        $neatline = $this->findById();

        // Output the JSON string.
        echo $this->_recordsTable->buildItemsJson($neatline);

    }

    /**
     * Sets the add success message.
     */
    protected function _getAddSuccessMessage($neatline)
    {
        return 'The Neatline "' . $neatline->name . '" was successfully added!';
    }

    /**
     * Sets the edit success message.
     */
    protected function _getEditSuccessMessage($neatline)
    {
        return 'The Neatline "' . $neatline->name . '" was successfully changed!';
    }

    /**
     * Sets the delete success message.
     */
    protected function _getDeleteSuccessMessage($neatline)
    {
        return 'The Neatline "' . $neatline->name . '" was successfully deleted!';
    }

    /**
     * Sets the delete confirm message.
     */
    protected function _getDeleteConfirmMessage($neatline)
    {
        return 'This will delete the Neatline "'. $neatline->name .'" '
             . 'and its associated metadata.';
    }

    /**
     * Construct the details form.
     */
    private function _getNeatlineDetailsForm(NeatlineExhibit $neatline)
    {

        $form = new Neatline_Form_NeatlineDetails(array(
            'neatline' => $neatline
        ));

        return $form;

    }

}
