.. _popup:

********
Overview
********

The purpose of this extension is to provide quick and streamlined access to the materials
on Blackboard Learn at the University of Rochester.

manifest.json
=============

BbQuick uses:

* a popup, :ref:`popup`
* a background page, :ref:`parsley`

It requires these permissions:

* http://my.rochester.edu/ to be able to get the user's data
* the browser's tabs to be able to capture the URL of a tab the user would like to save

The content security policy's default sources are:

* the extension itself
* http://my.rochester.edu/*

.. note::
    
    For a description of the content security policy, see the `W3 specification
    <http://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html>`_,
    particularly the `section describing each directive
    <http://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html>`_.
