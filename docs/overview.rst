.. _overview:

********
Overview
********

The purpose of this extension is to provide quick and streamlined access to the materials
on Blackboard Learn at the University of Rochester.

Features:

* Scrape all courses, course sections, and course subsections and display in easy to navigate hierarchy
* Scrape all announcements and display them below courses
* Allow user to show and hide any course, section, or subsection
* Allow user to add the active tab as a resource to any course


manifest.json
=============

BbQuick uses:

* a background page, :ref:`parsley`
* a popup, :ref:`popup`

It requires these permissions:

* ``*://my.rochester.edu/`` to be able to get the user's data (http or https is important!)
* the browser's tabs to be able to capture the URL of a tab the user would like to save

The content security policy's default sources are:

* the extension itself
* ``http://my.rochester.edu/*``

Then, for the style sources are set to be:

* the extension itself
* ``unsafe-inline``, so that jQuery works

.. note::
    
    For a description of the content security policy, see the `W3 specification
    <http://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html>`_,
    particularly the `section describing each directive
    <http://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html>`_.
