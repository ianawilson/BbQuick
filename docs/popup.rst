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

.. js:function:: popup.init()
    
    .. This is named popup.init to stop it from conflicting with the parsley version
        of init. There are no modules in the JavaScript domain, so there's no way
        to separate the namespaces.
    
    Gets the background page, :js:data:`bg`, and uses it to set local copies of 
    :js:data:`courses` and :js:data:`isAuthenticated`.
    
    Then, depending on parsley's state, it will run one of
    
    * :js:func:`showLogin`
    * :js:func:`showWait`
    * :js:func:`showMain`


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


.. js:function:: showLogin()
    
    Builds a "please login" page linking to Blackboard, as well as a "refresh BbQuick if you're already logged in" button.

.. js:function:: showWait()
    
    Builds a simple "please wait" page to be displayed while parsley is working.

.. js:function:: showMain()
    
    Builds the main page, which includes:
    
    * an "+Add Page" button (links to :js:func:`showAddPage`)
    * buttons for each course, each calling :js:func:`showCourse` for adding resources to BbQuick.

.. js:function:: showCourse(courseID)
    
    Builds a page for the given course, as identified by its ID. Sets :js:data:`activeCourse`
    to the given :js:data:`courseID`.
    
    :arg courseID: index of the course to display within :js:data:`courses`
    :type courseID: int or string representing an int
    
    * an "+Add Page" button, :js:func:`showAddPage`
    * a breadcrumb, with links
    * list of sections in the course, each calling :js:func:`showSection`
    * sorted list of announcements for this course

.. js:function:: showSection(courseID, sectionID)
    
    Builds a page for the given section, as identified by its ID and its course's ID. Sets
    :js:data:`activeCourse` to the given :js:data:`courseID` and :js:data:`activeSection`
    to the given :js:data:`sectionID`.
    
    :arg courseID: index of the course to display within :js:data:`courses`
    :type courseID: int or string representing an int
    :arg sectionID: index of the section to display within :js:data:`courses[courseID]['sections']`
    :type sectionID: int or string representing an int
    
    * an "+Add Page" button, :js:func:`showAddPage`
    * a breadcrumb, with links
    * list of subsections in the course, each opening those resources in a new tab

.. js:function:: showAddPage([courseID, sectionID])
    
    Builds a page for adding the current tab to BbQuick. It gives options for which
    course and which section to add the page to. There is a course list, and every
    time a different course is selected, a different section list is built, using
    :js:func:`rebuildSectionSelect`. The course and section default to whatever
    was active before coming to this page.
    
    :arg courseID: index of the course that we are coming from (default for course list)
    :type courseID: int or string representing an int
    :arg sectionID: index of the section that we are coming from (default for course list)
    :type sectionID: int or string representing an int
    
    * Builds course and section selectors
    * Builds function to call for submit button, which adds the current tab to the given course and section


Show / hide items
-----------------

These functions all facilitate showing and hiding of particular resources in BbQuick.
Some of this has been refactored, but we should consider reorganizing or continuing
to refactor all of this, as it's the least organized of everything.

.. js:function:: enterEdit()
    
    Enters the edit mode for show and hide, sliding down the "show" or "hide" buttons.
    All possible resources are also slid out so that they are visible.

.. js:function:: exitEdit()
    
    Exits the edit mode for show and hide, sliding up (hiding) all of the "show" and
    "hide" buttons. All resources marked as hidden are also slid up so that they are
    no longer visible.

.. js:function:: getHidden(buttonID)
                 setHidden(buttonID, hidden)
    
    Gets or sets the value for whether a button is hidden or not with its ID,
    which is assumed to be an integer or a string representation of an integer.
    Uses :js:data:`activeCourse` and :js:data:`activeSection` to figure out
    how to find the correct resource using the ID.
    
    .. note::
        :js:func:`getHidden` returns a boolean, and the arg :js:data:`hidden` for
        :js:func:`setHidden` should be a boolean.

.. js:function:: hideButton(buttonID)
    
    This sets up everything for the button with the given ID to be hidden.
    It sets the correct show or hide button (with an arrow facing the right
    direction) and adds a click handler to unhide the button.
    
    .. note:: This is probably the least semantic of functions, and its
        functionality should potentially be reorganized or renamed.


Misc helpers
------------

.. js:function:: clearAll()
    
    Clears all of the divs that are dynamically generated so that we never get
    conflicting IDs. Clear the divs with these ids:
    
    * ``main``
    * ``course``
    * ``section``

.. js:function:: makeAnnouncements(divSelector, announcements)

    Get the announcements and put them in the div that is selected by the given
    :js:data:`divSelector`.
    
    :arg divSelector: a jQuery selector that will provide the element to append the announcements to
    :type divSelector: String
    :arg announcements: the announcements to display
    :type announcements: list containing dicts
    
    The announcements will probably come from :js:func:`getRecentAnnouncements`,
    and are assumed to have the following keys:
    
    * ``author``
    * ``date``
    * ``details``

.. js:function:: rebuildSectionSelect(courseID, sectionID)
    
    Rebuild the section selection list, assumed to be the element with the id
    ``sectionSelect``. Rebuild using the given :js:data:`courseID`, and default
    the value to the given :js:data:`sectionID`.
    
    :arg courseID: index of the course from :js:data:`courses` to display sections for
    :type courseID: int or string representing an int
    :arg sectionID: index of the section from :js:data:`courses[courseID]['sections']` to make the default selection
    :type sectionID: int or string representing an int

