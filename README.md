BbQuick
=======

*You'll be licking your fingers by the time you're done.*

A Chrome Extension for the Blackboard Learn installation
at the University of Rochester. Its aim is to be fast and simple, distilling
all of the information in your Blackboard account into a clean and simple
interface.


Immediate To Do
---------------

- Document the work completed so far
- Potentially change announcement sort to sort by ID (will properly place announcements without dates)
- Store information locally to persist across sessions
    - localStorage is an associative array, eg localStorage['foo'] = 'bar'; persists across sessions
    - Could use the variable, name, as the UID in localStorage
- find a way to show updating / scraping progress, or at least to know when it's done, rather than guessing with timeouts
    - In general, clean up the parsley init function and how everything is triggered.
    - Make it more on-demand, or at least faster


Long Term To Do
---------------

- Reorganize all of the files; they're a mess!
- Manifest should be reviewed; used to have wide open security policies for Django app and other things we tried
- User should be able to make custom sections
- User should be able to permanently remove self-added content
- Need a way to figure out if a person is logged in or not (don't try to scrape if they aren't!)
- Need a way to deal with a *different* person being logged in. Can we tell they are different? Is there a UID?
- Delete old course entries that do no exist any more (not sure what this means...)
- Deal with courses that don't use announcements or that put something else as the home page for the course



Wishlist
--------

- If you hit it at just the right time (looks like during an updateCourses?) it says "Please wait", which is annoying and the whole point of updateCourses ...
- Doesn't work for TAs (and probably teachers)
- Suppress or eliminate all of the GET errors from bringing all of the Bb code into jQuery. blech
- Bring in Assignment Due Dates
- Put a login form in the popup. The Blackboard form relies on too much external (and therefore "unsafe") JavaScript, so we can't use that as-is. We could probably write our own form that posts the right info to the right place, though.
- Make it generic: set your own Blackboard URL (bbURL), modify / extend the scraping to deal with different styles of Blackboard layout (if they are are different)
    - Jeff suggested that to make it generic, maybe we could have user-selectable scraping filters (drag and select over whatever you want)


Scraping Process
================

- Do a GET for "my.rochester.edu"
- Process: find the "content" frame, find the URL for that
- GET content frame URL
- Process: find each course, collect URLs
- loop on course URLs, GET for each
    - Process: find resource / button for each course, collect URLs
    - loop on resources, GET for each
        - Process: find sub-resources / buttons for each resource, collect content or URLs


Structure for Course Information Data Structure
===============================================

- dictionary localStorage or JSON
    - key 'courses': array of courses, each being a dict
        - key 'name', eg 'Human Computer Interaction'
        - key 'url'
        - key 'shortname', eg 'csc212'
        - key 'sections': array of sections, each being a dict
            - key 'name', eg 'Syllabus'
            - key 'url'
            - key 'subsections', may be null if none exist: array of sections, each being a dict
                - key 'name', eg 'Assignment #1'
                - key 'url'


Notes and Credits
=================

We're using Gouch's JS implementation of to-title-case (https://github.com/gouch/to-title-case).

This project started development for Jeff Bigham's *Human Computer Interaction*
class (CSC212) at the University of Rochester in the Fall of 2011.

