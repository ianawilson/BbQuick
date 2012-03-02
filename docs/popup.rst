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




Sections or Pages
-----------------




Show / hide items
-----------------




Misc helpers
------------

