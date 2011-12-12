BbQuick
=======

A Chrome Extension and hand-crafted API for the Blackboard Learn installation
at the University of Rochester. It's aim is to be fast and simple, distilling
all of the information in your Blackboard account into a clean and simple
interface.

*You'll be licking your fingers by the time you're done.*


To Do
-----

- Being able to make custom sections
- Being able to permanently remove added content
- Delete old course entries that do no exist any more
- should we get rid of the semester on each course? eg 2011Fall
- Deal with courses that don't use announcements / don't put announcements as the home page for the course

Scraping Process
----------------

- Do a GET for "my.rochester.edu"
- Process: find the "content" frame, find the URL for that
- GET content frame URL
- Process: find each course, collect URLs
- loop on course URLs, GET for each
    - Process: find resource / button for each course, collect URLs
    - loop on resources, GET for each
        - Process: find sub-resources / buttons for each resource, collect content or URLs

views:

- getContentURL
- isAuthenticated
- getCourses
- getCourseSections
- getCourseSubsections

additional written but unused views:

- getNavURL (part of failed attempt to get things from Course page)
- getCoursesURL (ditto)


Notes and Ideas
---------------

- localStorage is an associative array, eg localStorage['foo'] = 'bar'; persists across sessions
- CSRF in Django is turned off since this simply parses html
- permissions in our manifest are currently wide open !!
- doesn't work for TAs (and probably teachers)

Structure for Course Information Data Structure
-----------------------------------------------

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


Wishlist
--------

- Need a way to figure out if a person is logged in or not (don't try to scrape if they aren't!)
    - check 
- proper try/except blocks for BeautifulSoup so that we don't get totally useless 500 errors
    - return json with 'error' key, find a way to deal with this / display in extension


Requirements
------------

- Python 2.7
- Beautiful Soup 3.2.0


Note
----

This project is being developed for Jeff Bigham's *Human Computer Interaction*
class (CSC212) at the University of Rochester.

