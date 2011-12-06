BbQuick
=======

A Chrome Extension and hand-crafted API for the Blackboard Learn installation
at the University of Rochester. It's aim is to be fast and simple, distilling
all of the information in your Blackboard account into a clean and simple
interface.

*You'll be licking your fingers by the time you're done.*


To Do
-----

- Learn about Scrapy http://scrapy.org/




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


Notes and Ideas
---------------

- localStorage is an associative array, eg localStorage['foo'] = 'bar'; persists across sessions
- CSRF in Django is turned off since this simply parses html
- permissions in our manifest are currently wide open !!
- You can use cURL to make some quick, fake POSTs to the test server. eg:
    curl -XPOST -HContent-type:text/plain --data "html=<html><body><p>asdf</p></body></html>" http://localhost:8000/isAuthenticated/
    


Wishlist
--------

- Need a way to figure out if a person is logged in or not (don't try to scrape if they aren't!)
    - check 
- Bb login in popup if user isn't logged in already
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

