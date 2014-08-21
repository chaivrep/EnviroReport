EnviroReport
============

A web dashboard for showing temp and humidity data from a Tessel.

The dashboard is built on top of Meteor.js.  Since the Tessel does not currently support web sockets, it makes http PUT requests to the Meteor app, which stores the temperature and humidity data in the database and renders it to the view.

If you don't have a Tessel, you can simulate one using the file in the localTestFile folder.  Just run the JS file inside using node.  It will push data to a copy of the Meteor app running locally.

You can view a demo here: http://youtu.be/knJrSxi867M

To get started:

##Set Up the Meteor App

1. Using your Terminal, install [Meteor.js](http://docs.meteor.com/#quickstart): ```$ curl https://install.meteor.com | /bin/sh```
2. Again using your terminal, install Meteorite, the Meteor package manager (similar to Node's npm): ```$ npm install -g meteorite```
3. Clone this repository and navigate to the 'meteor' directory.
4. Install the package dependencies with:```$ mrt install```
5. You can check out your app locally using ```$ meteor``` Go to http://localhost:3000 to see it in action.  There's nothing exciting going on because it's not receiving any data. You can simulate data by opening another Terminal and going to the localTestFile directory. Run the file using ```$ node enviroReportLocalTest.js``` (If you don't have Node.js, you can get it [here](http://nodejs.org/))
6. Once you see it working, you can deploy the app to Meteor's hosting service. ```$ meteor deploy [somename].meteor.com```


##Set up the Tessel

1. In your Terminal, navigate to the 'Tessel' directory.
2. In enviro.js, change line 8 to the URL where you deployed your Meteor app.
3. Be sure you have [installed the npm package](https://tessel.io/docs/climate) for the climate module.
4. Plug in your climate module and atart up your Tessel.  Make sure it's connected to wifi.
5. Run enviro.js on your Tessel: ```$ tessel push enviro.js```
6. You should now see data start appearing in your Meteor app.
