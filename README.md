EnviroReport
============

A web dashboard for showing temp and humidity data from a Tessel.

The dashboard is built on top of Meteor.js.  Since the Tessel does not currently support web sockets, it makes http PUT requests to the Meteor app, which stores the temperature and humidity data in the database and renders it to the view.

If you don't have a Tessel, you can simulate one using the file in the localTestFile folder.  Just run the JS file inside using node.  It will push data to a copy of the Meteor app running locally.

You can view a demo here: http://youtu.be/knJrSxi867M
