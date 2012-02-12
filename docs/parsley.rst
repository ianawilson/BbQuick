.. _parsley:

************
parsley.html
************

This is the parsing engine for BbQuick. The JavaScript version was ported from Python.

The idea behind parsley is to gather information from Blackboard about the currently 
logged in user. It can detect whether someone is authenticated or not, and parses
pages to collect their courses and a good deal of the content contained within
those courses. All of this is organized into a hierarchy of associative arrays and
arrays.


.. _courses_layout:

How the courses object is structured
====================================

The :js:data:`courses` object contains all of the information about the users' courses
and is laid out like this:

* :js:data:`courses`, itself, is an array or list of all of the courses for the given user.
* Each entry in :js:data:`courses` is an associative array or dictionary containing information about the course. The keys are:

    * ``shortname`` - (String) the a 5-6 character code like MTH161 for course 161 in the Math department
    * ``name`` - (String) the real name of the class (most human readable)
    * ``semester`` - (String) the semester that this course is from
    * ``url`` - (String) the relative url to the course page
    * ``sections`` - (Array) an array of the sections that are in this course (more below)

* Each entry in ``sections`` list is an associative array, containing information about the section. **NOTE:** The first entry is *always* Announcements. The keys are:

    * ``name`` - (String) the name of the section (eg, these might be *Announcements*, *Readings*, or *Assignments*)
    * ``url`` - (String) the relative url to the section page or the resource if it is a direct, external link
    * ``subsections`` - (Array) an array of the subsections for this section (eg, this might be individual readings, assignments, or announcements)

* Each entry in the ``subsections`` list is an associative array containing all of the information for that particular item. All subsections *except* announcements have the same structure. The keys for *non-announcement* subsections are:

    * ``id`` - (String) a unique ID for this item in the Blackboard system
    * ``name`` - (String) the name of this element
    * ``url`` - (String) the URL to this resource; if this resource is on Blackboard, the URL is relative; if it is external, then it is absolute

* When ``subsections`` is used for the Announcements section, it uses the following keys:

    * ``name`` - (String) the title or subject of the announcement
    * ``id`` - (String) the unique ID for this announcement on Blackboard
    * ``author`` - (String) the name of the person who authored this announcement
    * ``date`` - (String) a string representing the date (as scraped from Blackboard; not guaranteed to exist)
    * ``details`` - (String) the html content of the announcement


.. _scraping_pseudo_code:

Pseudo-code for scraping
========================

This is the pseudo code for how parsley works through Blackboard to collect information about the users' courses:

* ``GET my.rochester.edu``
* Process: find the ``content`` frame, collect the URL for that
* ``GET`` content frame URL
* Process: find each course, collect URLs
* Loop on course URLs, ``GET`` for each

    * Process: find resource / button for each course, collect URLs
    * Loop on resources, ``GET`` for each
    
        * Process: find sub-resources / buttons for each resource, collect content or URLs


How to use and interact with Parsley
====================================

This section details how to use and interact with Parsley. Detailed reference for all of these
objects and functions is linked below and listed in :ref:`outward_reference`.


Initialization
--------------

Call :js:func:`init` as often as you like to manually update :js:data:`isAuthenticated` and
:js:data:`courses` to the latest information.

.. warning:: This information is not available immediately. Currently,
    the timeouts for various operations require that you wait at least 20 seconds
    before assuming the data stored is up to date.

.. note:: This function automatically executes every 5 minutes, and you won't normally need to
    call it unless you're in a hurry.


Doing Things
------------

Assuming they are up to date, :js:data:`isAuthenticated` and :js:data:`courses` are almost all you'll
need. You can check :js:data:`isAuthenticated` to decide whether to prompt the user to log into
their Blackboard account, and, once they are, you can access all of their courses in the 
:js:data:`courses` object.

For a complete overview of the :js:data:`courses` object, see :ref:`courses_layout`.

To get recent announcements from all courses, use :js:func:`getRecentAnnouncements`. It takes one optional
argument, the maximum number of announcements to fetch. It will return an array of chronologically sorted
announcements (each being an associative array; for specifics see :ref:`courses_layout`).


Ensuring URLs are all proper and absolute
-----------------------------------------

You can never know for sure whether the URLs from sections and subsections will be absolute or relative,
but you don't need to worry about it when you use :js:func:`makeURL`. This takes a URL from a section
or subsection and returns an absolute version of it, appending it to the Blackboard URL if necessary.


Object and Function Reference
=============================

.. _outward_reference:

Outward Facing Objects and Functions
------------------------------------

.. js:data:: isAuthenticated
    
    ``boolean`` defining whether parsley thinks the user is logged in or not
    
.. js:data:: courses
    
    ``Array`` containing all of the courses (including sections and subsections) for the user
    
    For a complete overview of, see :ref:`courses_layout`.

.. js:function:: init()
    
    Wraps all of the functionality to set up and update information about the user
    
    :returns: nothing
    
    #. Calls :js:func:`checkAuthenticated`
    #. Sets a 10 second timeout to call :js:func:`getCourses`
    #. Sets a 20 second timeout to call :js:func:`updateCourses`
    
    It uses timeouts because both :js:func:`checkAuthenticated` and :js:func:`getCourses` are *asynchronous*.
    Because of that, this function will return about 20 seconds *before* :js:data:`courses` has been updated.
    
.. js:function:: getRecentAnnouncements([limit])
    
    Gets recent announcements from all courses, and combines them into one, chronological array
    
    :param limit: maximum number of announcements to fetch; default is 10
    :type limit: ``int``
    :returns: ``Array`` of chronologically sorted announcements of length :data:`limit`
    
    #. Set up an empty array for announcements
    #. Loop through courses, for each:
        * Get subsections for first section (announcements are *always* the first section)
        * Concatenate the the announcement subsection array to the announcement array defined above
    #. Loop through gathered announcements and remove any that do not have authors
    #. Sort all announcements chronologically using :js:func:`announceSorted`
    #. Keep only the first :data:`limit` announcements, return these

.. js:function:: makeURL(url)

    Takes a url and 
    
    * if it is absolute, it simply returns it
    * if it is relative, it appends it to the :js:data:`bbURL`
    
    :param url: URL to evaluate
    :type url: ``String``
    :returns: ``String``, a complete absolute URL

Internal Objects and Functions
------------------------------

.. js:data:: bbURL
    
    A ``String``, the URL of the Blackboard website
    
    .. warning:: This **must** not end with a slash.
    
.. js:data:: contentURL
             headerURL
             coursesURL
    
    ``String``\s, URLs of different frames gathered by :js:func:`getContentURL` and :js:func:`getCourses`
    
.. js:data:: name
    
    ``String``, the name of the current user, as gathered by :js:func:`getContentURL`
    
    While not guaranteed to be unique, this is the closest we have to a UID from the Blackboard web interface.

.. js:data:: newCourses
    
    ``Array``, updated by :js:func:`getCourses`, used by :js:func:`updateCourses` to update :js:data:`courses`
    
    Because :js:func:`getCourses` is asynchronous, it could fill up slowly, and we don't want to partially
    alter :js:data:`courses`. so we use this to store the courses temporarily as we gather them, and then
    update :js:data:`courses` in one go using :js:func:`updateCourses` to minimize the chance that data will
    be partially displayed.
    

.. js:data:: initTimeout
             updateCoursesTimeout
    
    Timeouts used by :js:func:`init`
    
.. js:function:: getCourses()

    If authenticated, gets all of the user's courses and course resources
    
    :returns: nothing
    
    Also see :ref:`scraping_pseudo_code`.
    
    #. ``GET`` the content frame, and look for an element with class ``moduleTitle`` which contains the words "Courses Online"
    #. Set :js:data:`newCourses` to a new, empty ``Array``
    #. Grab all of the ``<tr>``\s from this element and loop through them, for each:
        * If it contains an anchor tag, that has everything
        * ``href`` is the URL
        * The text content can be split into the shortname, semester, and full name
    #. Loop through the collected courses and call :js:func:`getCourseSections` for each

.. js:function:: getCourseSections(course)
    
    

.. js:function:: getCourseSubsections(sections)
.. js:function:: updateCourses()
.. js:function:: findSubMember(arr, member, value)
.. js:function:: getContentURL(callback)
.. js:function:: checkAuthenticated()
.. js:function:: announceSorted(item)
