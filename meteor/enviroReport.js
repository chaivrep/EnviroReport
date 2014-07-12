EnviroPoints = new Meteor.Collection("enviropoints");

var limit = 12;

if (Meteor.isClient) {

  var chartData = [],
    tempGaugeChart = null,
    humidGaugeChart = null,
    chart = null;

  AmCharts.ready(function(){
    tempGaugeChart = AmCharts.makeChart("tempchartdiv", {
      "type": "gauge",
      "theme": "none",    
      "axes": [{
          "axisThickness":1,
           "axisAlpha":0.2,
           "tickAlpha":0.2,
           "valueInterval":10,
          "bands": [{
              "color": "#5bc0de",
              "endValue": 65,
              "startValue": 0
          }, {
              "color": "#5cb85c",
              "endValue": 80,
              "startValue": 65
          }, {
              "color": "#d9534f",
              "endValue": 120,
              "innerRadius": "95%",
              "startValue": 80
          }],
          "bottomTextYOffset": -20,
          "endValue": 120
      }],
      "arrows": [{}]
    });

    humidGaugeChart = AmCharts.makeChart("humidchartdiv", {
      "type": "gauge",
      "theme": "none",    
      "axes": [{
          "axisThickness":1,
           "axisAlpha":0.2,
           "tickAlpha":0.2,
           "valueInterval":10,
          "bands": [{
              "color": "#5cb85c",
              "endValue": 30,
              "startValue": 0
          }, {
              "color": "#f0ad4e",
              "endValue": 50,
              "startValue": 30
          }, {
              "color": "#d9534f",
              "endValue": 100,
              "innerRadius": "95%",
              "startValue": 50
          }],
          "bottomTextYOffset": -20,
          "endValue": 100
      }],
      "arrows": [{}]
    });

    chart = AmCharts.makeChart("chartdiv", {
      "type": "serial",
      "theme": "none",
      "pathToImages": "http://www.amcharts.com/lib/3/images/",
      "legend": {
        "useGraphSettings": true
      },
      "dataProvider": chartData,
      "valueAxes": [{
        "id":"v1",
        "axisColor": "#FF6600",
        "axisThickness": 2,
        "gridAlpha": 0,
        "axisAlpha": 1,
        "position": "left",
        "maximum": 100,
        "minimum": 32,
        "title": "Temp (F)"
      }, {
        "id":"v2",
        "axisColor": "#FCD202",
        "axisThickness": 2,
        "gridAlpha": 0,
        "axisAlpha": 1,
        "position": "right",
        "maximum": 100,
        "minimum": 0,
        "title": "Humidity (%)"
      }],
      "graphs": [{
        "valueAxis": "v1",
        "lineColor": "#FF6600",
        "bullet": "round",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Temp (F)",
        "valueField": "temp",
        "fillAlphas": 0
      }, {
        "valueAxis": "v2",
        "lineColor": "#FCD202",
        "bullet": "square",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Humidity (%)",
        "valueField": "humidity",
        "fillAlphas": 0
      }],
      "chartScrollbar": {},
      "chartCursor": {
        "cursorPosition": "mouse"
      },
      "categoryField": "date",
      "categoryAxis": {
        "parseDates": false,
        "axisColor": "#DADADA",
        "minorGridEnabled": true
      }
    });
  });

  //Load up the existing points so they can be displayed on startup
  Meteor.startup(function () {
    Meteor.subscribe('points', {}, onReady = function() {
      //Pull all but the last record; it will be added by the reactive function.
      var d = EnviroPoints.find({}, {sort: {time: 1}, limit: (limit - 1)});
      d.forEach(function(point) {
        updateChartAndGauges(point);
      });
    });
  });

  //Add a new data point to the hostorical chart, then refresh the chart and gauges
  updateChartAndGauges = function(point){
    chartData.push({date: moment(new Date(point.time)).format("h:mm:ss A"), temp: point.temp, humidity: point.humidity});
    $('#currDateTime').html(new Date(point.time).toLocaleString());
    if (chart && tempGaugeChart && humidGaugeChart) {
      chart.validateData(); 
      tempGaugeChart.arrows[0].setValue(point.temp);
      tempGaugeChart.axes[0].setBottomText(point.temp + ' F');
      humidGaugeChart.arrows[0].setValue(point.humidity);
      humidGaugeChart.axes[0].setBottomText(point.humidity + '%');
    };
  };

  //Called reactively to add a new point to the historical chart and update gauges.
  Template.dashboard.jscharts = function(){
    var d = EnviroPoints.findOne({}, {sort: {time: -1}});
    if (d && chart){
      //If there are more than 'limit' points on the historical chart, remove the oldest point
      if (chartData.length > limit) {
        chartData.shift();
      }
      updateChartAndGauges(d);
    } 
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // All values listed below are default
    collectionApi = new CollectionAPI({
      //authToken: '123456',               // Require this string to be passed in on each request
      apiPath: 'api',                      // API path prefix
      standAlone: false,                   // Run as a stand-alone HTTP(S) server
      sslEnabled: false,                   // Disable/Enable SSL (stand-alone only)
      listenPort: 3005,                    // Port to listen to (stand-alone only)
      listenHost: undefined,               // Host to bind to (stand-alone only)
      //privateKeyFile: 'privatekey.pem',  // SSL private key file (only used if SSL is enabled)
      //certificateFile: 'certificate.pem' // SSL certificate key file (only used if SSL is enabled)
    });

    collectionApi.addCollection(EnviroPoints, 'points', {
      //authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST'],  // Allow creating
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: function(obj) { 
          //Store only as many records as will be shown in the graph
          if (EnviroPoints.find().count() >= limit) {
            EnviroPoints.remove(EnviroPoints.findOne({}, {sort: {time: 1}})._id);
          };
          return true
          },  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Starts the API server
    collectionApi.start();

    //Publish data points
    Meteor.publish('points', function() {
      return EnviroPoints.find({}, {sort: {time: 1}, limit: limit});
      this.ready();
    });

  });
}
