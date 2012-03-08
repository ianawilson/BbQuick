.. _popup:

**********
popup.html
**********

Structure
---------

There are six divs, all with the classes ``wrapper`` and ``hidden``. The ids for these are

* ``login``
* ``wait``
* ``main``
* ``course``
* ``section``
* ``add``


Initialization and Global Variables
-----------------------------------

.. js:data:: bg
    
    The extension's background page, :ref:`parsley`. This is used to make :js:data:`courses` and
    :js:data:`isAuthenticated` available in the popup.

.. js:data:: buttonHtml
             announceHtml
             addPageHtml
             breadcrumbHtml
             editShowHideHtml
    
    These are all boilerplate HTML snippets for commonly used and reused chunks.

.. js:data:: activeCourse
             activeSection
    
    Has the index of the active course or section. Used primarily by :js:func:`getHidden` and :js:func:`setHidden`.


Run Handlers
------------

.. js:function:: runHandlers
    
    This function runs a set of handlers on everything that is in the popup. It does the following:
    
    * Adds mouseover / mouseout handlers for elements with the ``button`` class for highlighting
    * Places all of the "show / hide" buttons that allow the user to show and hide buttons
    * Finds all of non ``.internal``, non ``#breadcrumb a`` anchors and makes them open a new tab with the button's ``href``
    
    It should be run every time new buttons are generated (for every ``showFoo()`` method), so that everything in that will
    act appropriately.


Show "Page" Functions
---------------------

I put quotes around this, because they aren't really pages, but appear to be different pages to the end user. Maybe one day
they should be separated out into individual pages for clarity, but for now, they are simply divs which are switched between.

The functions correspond one-to-one with the divs, so we have the following functions:

* :js:func:`showLogin`
* :js:func:`showWait`
* :js:func:`showMain`
* :js:func:`showCourse`
* :js:func:`showSection`
* :js:func:`showAddPage`

Each of these functions first hides everything else (by calling :js:func:`clearAll`), builds its div, calls
:js:func:`runHandlers`, and makes its div visible.


.. js:function:: showLogin
    
    

.. js:function:: showWait
    
    

.. js:function:: showMain
    
    

.. js:function:: showCourse(courseID)
    
    

.. js:function:: showSection(courseID, sectionID)
    
    

.. js:function:: showAddPage([courseID, sectionID])
    
    




Show / hide items
-----------------




Misc helpers
------------

