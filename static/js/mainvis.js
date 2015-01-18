//main visualisation global variables.
var mainVis = null;
var maindata = null;
var mainfocus = false;
var tickformat = '.2f';

//data indexes to speedup data retrieval. Otherwise its too laggy
var inflationIndex;
var unemploymentIndex;
var inflationValIndex = {};
var unemploymentValIndex = {};

//upper visulisations
var leftVis = null;
var middleVis = null;
var rightVis = null;
var leftVisData = null;
var middleVisData = null;
var rightVisData = null;
window.onload = function (e) {
    //removeGraph('main',mainVis);
    nv.log('loaded');
    drawmain(mainfocus, true, true);
    //drawUpperVisualisations();

};

function drawmain(focus, interactive, tooltips) {
    d3.json("/vis/main_data/", function (error, data) {
        removeGraph('main', mainVis);
        nv.addGraph(function () {
            var chart;
            if (focus) {
                chart = nv.models.lineWithFocusChart().margin({left: 60});
                chart.y2Axis.tickFormat(d3.format(tickformat));
                //chart.useInteractiveGuideline(interactive);
            } else {
                chart = nv.models.lineChart().margin({left: 60});
                chart.useInteractiveGuideline(interactive);
            }
            //chart.interpolate("step");
            //chart.title('Historic Data Visualisation').titleOffset(-10);
            //console.log('Main width: '+parseInt(d3.select('#main').style('width'))+' height: '+parseInt(d3.select('#main').style('height')));
            //chart.width(parseInt(d3.select('#main').style('width')));
            //chart.height(parseInt(d3.select('#main').style('height')));
            chart.xAxis.axisLabel('Years');
            chart.xAxis.tickFormat(d3.format('f'));
            chart.yAxis.tickFormat(d3.format(tickformat));
            //chart.yAxis.axisLabel('£ Thousands').axisLabelDistance(-10);
            chart.clipEdge(true);

            getindexes(data); // get indexes of all needed series. e.g. index 1 is inflation
            chart.y(function (d) {
                if (d.y == "") return null;
                if (d.series = inflationIndex) inflationValIndex[d3.format(tickformat)(d.y)] = d.x;
                if (d.series = unemploymentIndex) unemploymentValIndex[d3.format(tickformat)(d.y)] = d.x;
                return parseFloat(d.y)
            });
            chart.x(function (d) {
                return parseFloat(d.x)
            });
            chart.tooltips(tooltips);
            chart.tooltipContent(function (key, x, y, e, graph) {
                return '<h3>' + key + '</h3>' +
                    '<p>' + y + ' in ' + x + '</p>'
            });
            console.log('drawing main, interactive tooltip: ' + interactive + ' tooltip:' + tooltips);
            d3.select('#main svg')
                .datum(data)
                .transition()//.duration(300)
                .call(chart);
            nv.utils.windowResize(chart.update);
            mainVis = chart;
            maindata = data;
            /*chart.dispatch.on('elementMousemove', function(e){
             console.log('element: ');
             //console.dir(e.point);
             });*/
            //console.log(inflationValIndex);
            /*Events Handlers*/
            if (chart.interactiveLayer != null) {
                chart.interactiveLayer.dispatch.on('elementMousemove.mainphillips', function (e) {
                    if (leftVis != null) {
                        leftVis.lines.clearHighlights();
                        middleVis.lines.clearHighlights();
                        rightVis.lines.clearHighlights();
                        //pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
                        //console.log(e.point+'  '+'   '+ e.pointXValue+'   '+ e.target);
                        //var lastXVal = parseInt(data[0].values[data[0].values.length - 1].x);
                        //var startingXVal = parseInt(data[0].values[0].x);
                        //var inflationSeries;
                        //var unemploymentSeries;
                        /*data.forEach(function(series, i){
                         if(!series.key.indexOf('Inflation'))inflationSeries=series.values;
                         if(!series.key.indexOf('Unemployment'))unemploymentSeries=series.values;
                         });*/
                        //inflationSeries = data[inflationIndex].values;
                        //unemploymentSeries = data[unemploymentIndex].values;
                        //console.log(leftVisData[1]);
                        //var inflation = inflationSeries[Math.round(e.pointXValue) - inflationSeries[0].x].y;
                        //var unemployment = unemploymentSeries[Math.round(e.pointXValue) - unemploymentSeries[0].x].y;
                        //var inflationIn = Math.round(e.pointXValue) - (inflationSeries[0].x);
                        //var unemploymentIn = Math.round(e.pointXValue) - (startingXVal + leftVisData[1].values.length);
                        var leftPointIndex = Math.round(e.pointXValue) - (leftVisData[1].startXIndex);
                        var middlePointIndex = Math.round(e.pointXValue) - (middleVisData[1].startXIndex);
                        var rightPointIndex = Math.round(e.pointXValue) - (rightVisData[1].startXIndex);
                        //console.log(e.pointXValue+' '+ (unemploymentSeries[0].x+leftVisData[1].values.length));
                        //console.log(' pointIndex: '+pointIndex);
                        leftVis.lines.highlightPoint(0, leftPointIndex, true);
                        leftVis.lines.highlightPoint(1, leftPointIndex, true);
                        middleVis.lines.highlightPoint(0, middlePointIndex, true);
                        middleVis.lines.highlightPoint(1, middlePointIndex, true);
                        rightVis.lines.highlightPoint(0, rightPointIndex, true);
                        rightVis.lines.highlightPoint(1, rightPointIndex, true);
                    }

                });
                chart.interactiveLayer.dispatch.on('elementMouseout.mainphillips', function (e) {
                    if (leftVis != null)leftVis.lines.clearHighlights();
                    if (middleVis != null)middleVis.lines.clearHighlights();
                    if (rightVis != null)rightVis.lines.clearHighlights();
                });
            }
            drawUpperVisualisations();
            return chart;
        });
    });
}
function getindexes(data) {
    data.forEach(function (series, i) {
        if (!series.key.indexOf('Inflation'))inflationIndex = i;
        if (!series.key.indexOf('Unemployment'))unemploymentIndex = i;
    });
}
function removeGraph(graph, chartobject) {
    if (chartobject != null) chartobject.tooltips(false);//chartobject.useInteractiveGuideLines(false);
    d3.selectAll("#" + graph + " svg > *").remove();
}
function setInteractiveMode() {
    console.log("setting interactive   ");
    //removeGraph('main');
    mainVis.tooltips(false);
    if (mainfocus) {
        mainfocus = !mainfocus;
        drawmain(mainfocus, true, true);
    }
    else if (mainVis.useInteractiveGuideline() == true) {
        console.log('interactive is true:   ' + mainVis.useInteractiveGuideline());
        drawmain(mainfocus, false, true);
    } else {
        console.log('interactive is false');
        drawmain(mainfocus, true, true);
    }
}

function setFocusMode() {
    console.log("setFocus Mode");
    //removeGraph('main');
    mainfocus = !mainfocus;

    drawmain(mainfocus, false, true);
}

function NormaliseMode() {

}

//TOP RIGHT CHART
//Draw the top left visualisation
function drawleftvis(leftAxis, bottomAxis) {
    leftVisData = upperVisData(leftAxis, bottomAxis, phillipsCurve());
    drawUpperVis('leftvis', leftAxis, bottomAxis, leftVisData);
}

//Draw the top left visualisation
function drawmiddlevis(leftAxis, bottomAxis) {
    middleVisData = upperVisData(leftAxis, bottomAxis, lafferCurve());
    drawUpperVis('middlevis', leftAxis, bottomAxis, middleVisData);
}

//Draw the top left visualisation
function drawrightvis(leftAxis, bottomAxis) {
    rightVisData = upperVisData(leftAxis, bottomAxis, ISLMCurve());
    drawUpperVis('rightvis', leftAxis, bottomAxis, rightVisData);
}

/*A asynchronous callback wrapper. This makes the upper visualisations wait for the main visualisation to be drawn*/
function drawUpperVisualisations() {
    drawleftvis('Inflation (CPI) %', 'Unemployment %');
    drawmiddlevis('Tax Revenue, GDP %', 'Income Tax Rate, avg %');
    drawrightvis('Interest Rate %', 'Real GDP, billions 2008 £');
}
function drawUpperVis(visid, leftLabel, bottomLabel, data) {
    nv.addGraph(function () {
        console.log('drawing ' + visid);
        var chart = nv.models.lineChart();
        chart.xAxis.tickFormat(d3.format(tickformat)).tickValues([]);
        chart.yAxis.tickFormat(d3.format(tickformat)).tickValues([]);
        chart.yAxis.tickValues([]).showMaxMin(true);
        chart.showLegend(false);
        chart.y(function (d) {
            if (d.y == "") return null;
            return parseFloat(d.y)
        });
        chart.x(function (d) {
            return parseFloat(d.x)
        });
        //chart.interpolate('linear-closed');
        //chart.pointShape('cross');
        if (leftLabel != null)chart.yAxis.axisLabel(leftLabel).axisLabelDistance(-30);
        if (bottomLabel != null)chart.xAxis.axisLabel(bottomLabel).axisLabelDistance(-17);

        //chart.xAxis.ticks(true);
        //chart.pointActive(function (d) {  return d.notActive;});
        //chart.width(parseInt(d3.select('#' + visid + ' svg').style('width')));
        //chart.height(parseInt(d3.select('#' + visid + ' svg').style('height')));
        chart.tooltipContent(function (key, x, y, e, graph) {
            var RGB = e.series.color;
            var alpha = '0.35';
            var backgroundcolor = 'rgba(' + parseInt(RGB.substring(1, 3), 16) + ',' +
                parseInt(RGB.substring(3, 5), 16) + ',' +
                parseInt(RGB.substring(5, 7), 16) + ',' + alpha + ')';
            var content = '<div class="toptooltiptitle" style="background-color: ';
            content += backgroundcolor + '">';
            content += key + '</div><p>' + leftLabel + ': ' + y + ',<br> ' + bottomLabel + ': ' + x + '</p>';
            return content;
        });
        chart.margin({"left": 40, "right": 30, "top": 10, "bottom": 30});
        d3.select('#' + visid + ' svg').datum(data).call(chart);
        nv.utils.windowResize(chart.update);

        if (visid == 'leftvis')leftVis = chart;
        else if (visid == 'middlevis')middleVis = chart;
        else if (visid == 'rightvis')rightVis = chart;

        /*Event Handlers*/
        chart.dispatch.on('tooltipShow.upper', function (e) {
            var x = (d3.format(tickformat)(e.point.x)), y = (d3.format(tickformat)(e.point.y)),
                mainMinVal = maindata[0].values[0].x;
            var inflationIndex;
            var unemploymentIndex;
            maindata.filter(function (series, i) {
                series.seriesIndex = i;
                return !series.disabled;
            }).forEach(function (series, i) {
                //if (!series.key.indexOf(leftLabel.split(" ")[0]))inflationIndex = i;
                //if (!series.key.indexOf(bottomLabel.split(" ")[0]))unemploymentIndex = i;
                if (series.key== leftLabel)inflationIndex = i;
                if (series.key== bottomLabel)unemploymentIndex = i;
            });
            //console.log('  x:'+ x+' '+' y:'+ y+' vind:'+inflationValIndex[y]+' xindex: '+ getXIndex(inflationValIndex[y],maindata[0].values));
            if (mainVis != null)mainVis.lines.highlightPoint(inflationIndex, inflationValIndex[y] - mainMinVal, true);
            if (mainVis != null)mainVis.lines.highlightPoint(unemploymentIndex, unemploymentValIndex[x] - mainMinVal, true);
        });
        chart.dispatch.on('tooltipHide.upper', function (e) {
            mainVis.clearHighlights();
        });
    });
}

function upperVisData(leftAxis, bottomAxis, theoreticalCurve) {
    var historicPhillipsCurve = [], unemploymentStartIndex,
        inflationSeries,
        unemploymentSeries;
    if (maindata == null) return;
    //console.log('drawing scatter phillips');
    maindata.forEach(function (series, i) {
        if (series.key== leftAxis)inflationSeries = series.values;
        if (series.key== bottomAxis)unemploymentSeries = series.values;
    });
    var first = false;
    for (var i = 0; i < unemploymentSeries.length; i++) {

        var unemploymentVal = unemploymentSeries[i].y, inflationVal = inflationSeries[i].y;
        //console.log({x:unemploymentVal, y:inflationVal});
        if (unemploymentVal != '' && inflationVal != '') {
            if (first == false) {
                unemploymentStartIndex = unemploymentSeries[i].x;
                first = !first;
            }
            historicPhillipsCurve.push({x: unemploymentVal, y: inflationVal, shape: 'circle'});
        }
    }
    return [
//area: true,
        {
            values: theoreticalCurve,
            key: "Theoretical Curve",
            color: "#0000CD"
        },
        {
            values: historicPhillipsCurve,
            key: "Historic Values",
            color: "#2ca02c",
            startXIndex: unemploymentStartIndex
        },
    ];
}

function phillipsCurve() {
    var curve = [];
    for (var i = 1; i < 25; i++) {
        var y = Math.round(100 * ((1 / (i)) * 30 - 5)) / 100;
        //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
        curve.push({x: i, y: y == 0 ? 0.01 : y});

    }
    return curve;
}

function lafferCurve() {
    var curve = [];
    for (var i = 0; i <101; i++) {
        var iShift = i-50;
        var y = (-Math.pow((iShift)/10,2)+40);
        y = Math.round(100 * y) / 100; //round the value
        //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
        curve.push({x: i, y: y< 0 ? 0 : y});
    }
    return curve;
}

function ISLMCurve() {
    var curve = [];
    for (var i = 0; i <101; i++) {
        var iShift = i-50;
        var y = (-Math.pow((iShift)/10,2)+40);
        y = Math.round(100 * y) / 100; //round the value
        //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
        curve.push({x: i, y: y< 0 ? 0 : y});
    }
    return curve;
}