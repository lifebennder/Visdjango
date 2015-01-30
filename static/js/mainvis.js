//main visualisation global variables.
var mainVis = null;
var maindata = null;
var unNormalisedmaindata = null;
var Normalisedmaindata = null;
var mainfocus = false;
var maininteractive = true;
var maintooltips = true;
var tickformat = '.2f';
var backgroundcolour = true;
var isMainNormalised = false;
var navigationIndexes = [1692, 2019];
var navigationFilter = true;
//data indexes to speedup data retrieval. Otherwise its too laggy
//var inflationIndex;
//var unemploymentIndex;
var ValueIndexList = {}; // Data indexes for all the series. accessed using labels
//var inflationValIndex = {};
//var unemploymentValIndex = {};
//var duplicate = 0;
//upper visulisations
var leftVis = null;
var middleVis = null;
var rightVis = null;
var leftVisData = null;
var middleVisData = null;
var rightVisData = null;
window.onload = function (e) {
    removeGraph('main', mainVis);
    removeGraph('leftvis', leftVis);
    removeGraph('middlevis', middleVis);
    removeGraph('rightvis', rightVis);
    d3.json("/vis/main_data/", function (error, data) {
        unNormalisedmaindata = data;
        maindata = unNormalisedmaindata;
        drawmain(maindata);
    });
    nv.log('loaded');
    //drawmain(mainfocus, true, true);
    //drawUpperVisualisations();

};

function drawmain(data) {
    //d3.json("/vis/main_data/", function (error, data) {
    removeGraph('main', mainVis);
    nv.addGraph(function () {
        var chart;
        if (mainfocus) {
            chart = nv.models.lineWithFocusChart().margin({left: 60});
            chart.y2Axis.tickFormat(d3.format(tickformat));
            //chart.useInteractiveGuideline(maininteractive);
            chart.brushExtent(navigationIndexes);
            chart.dispatch.on('brush.user', function (brush) {
                //updateData(newState); //brush is returned and extent []
                navigationIndexes = brush.extent;
                //console.log(leftVis.xAxis.axisLabel());
                /* leftVisData[0].values.forEach(function (value, i) {
                 //value.series = 30; console.log(value);
                 });*/
                //leftVis.data = leftVisData;
                //removeGraph('leftvis',leftVis);
                if (navigationFilter) {
                    leftVisData = upperVisData(leftVis.yAxis.axisLabel(), leftVis.xAxis.axisLabel(), phillipsCurve());
                    middleVisData = upperVisData(middleVis.yAxis.axisLabel(), middleVis.xAxis.axisLabel(), lafferCurve());
                    rightVisData = upperVisData(rightVis.yAxis.axisLabel(), rightVis.xAxis.axisLabel(), ISLMCurve());
                    //rightVis.data = rightVisData;
                    //console.log(rightVisData);
                    d3.select('#leftvis svg').datum(leftVisData);
                    d3.select('#middlevis svg').datum(middleVisData);
                    d3.select('#rightvis svg').datum(rightVisData);
                    //drawUpperVisualisations();
                    leftVis.update();
                    middleVis.update();
                    rightVis.update();
                    //console.log(leftVis.data);
                }
            });
        } else {
            chart = nv.models.lineChart().margin({left: 60});
            chart.useInteractiveGuideline(maininteractive);
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
        //chart.clipEdge(true);

        //getindexes(data); // get indexes of all needed series. e.g. index 1 is inflation

        data.forEach(function (series, i) {
            ValueIndexList[series.key] = {};
            series.values.forEach(function (values, i) {
                if (values.y == "") return;
                var yy = d3.format(tickformat)(values.y);
                //console.log(value);
                ValueIndexList[series.key][yy] = values.x;
            });
        });

        chart.y(function (d) {
            if (d.y == "") return null;
            //var yy = d3.format(tickformat)(d.y);
            return parseFloat(d.y)
        });

        chart.x(function (d) {
            if (d.x == null) return null;
            return parseFloat(d.x)
        });
        chart.tooltips(maintooltips);
        chart.tooltipContent(function (key, x, y, e, graph) {
            return '<h3>' + key + '</h3>' +
                '<p>' + y + ' in ' + x + '</p>'
        });
        console.log('drawing main, interactive tooltip: ' + maininteractive + ' tooltip:' + maintooltips);
        d3.select('#main svg')
            .datum(data)
            .transition()//.duration(300)
            .call(chart);
        nv.utils.windowResize(chart.update);
        mainVis = chart;
        maindata = data;
        //Normalisedmaindata = maindata;

        /*Events Handlers*/
        if (chart.interactiveLayer != null) {
            chart.interactiveLayer.dispatch.on('elementMousemove.mainphillips', function (e) {
                if (leftVis != null && middleVis != null && rightVis != null) {
                    leftVis.lines.clearHighlights();
                    middleVis.lines.clearHighlights();
                    rightVis.lines.clearHighlights();
                    //var inflation = inflationSeries[Math.round(e.pointXValue) - inflationSeries[0].x].y;
                    //var unemployment = unemploymentSeries[Math.round(e.pointXValue) - unemploymentSeries[0].x].y;
                    //var inflationIn = Math.round(e.pointXValue) - (inflationSeries[0].x);
                    //var unemploymentIn = Math.round(e.pointXValue) - (startingXVal + leftVisData[1].values.length);
                    var leftPointIndex = Math.round(e.pointXValue) - (leftVisData[0].startXIndex);
                    var middlePointIndex = Math.round(e.pointXValue) - (middleVisData[0].startXIndex);
                    var rightPointIndex = Math.round(e.pointXValue) - (rightVisData[0].startXIndex);
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
        chart.dispatch.on('stateChange.main', function (newState) {
            updateData(newState);
            console.log('state change ');
        });
        chart.dispatch.on('changeState.main', function (newState) {
            updateData(newState);
            console.log('change state');
        });

        drawUpperVisualisations();
        return chart;
    });
    //});
}
function updateData(newState) {
    newState.disabled.forEach(function (disabled, i) {
        if (Normalisedmaindata != null)Normalisedmaindata[i].disabled = disabled;
        unNormalisedmaindata[i].disabled = disabled;
    });
}
/*function getindexes(data) {
 data.forEach(function (series, i) {
 if (!series.key.indexOf('Inflation'))inflationIndex = i;
 if (!series.key.indexOf('Unemployment'))unemploymentIndex = i;
 });
 }*/
function removeGraph(graph, chartobject) {
    if (chartobject != null) chartobject.tooltips(false);//chartobject.useInteractiveGuideLines(false);
    d3.selectAll("#" + graph + " svg > *").remove();
}
function setInteractiveMode() {
    console.log("setting interactive   ");
    //removeGraph('main');
    mainVis.tooltips(false); //TODO MAYBE REMOVE THIS
    if (mainfocus) {
        mainfocus = !mainfocus;
        drawmain(maindata);
    }
    else if (mainVis.useInteractiveGuideline() == true) {
        console.log('interactive is true:   ' + mainVis.useInteractiveGuideline());
        maininteractive = false;
        drawmain(maindata);
    } else {
        console.log('interactive is false');
        maininteractive = true;
        maintooltips = true;
        drawmain(maindata);
    }
}

function setFocusMode() {
    console.log("setFocus Mode");
    //removeGraph('main');
    mainfocus = !mainfocus;
    drawmain(maindata);
}
function navigationFilterToggle() {
    navigationFilter = !navigationFilter;
    setUpperVisData();
}

function setUpperVisData(data) {
    if (data == undefined || data == null) {
        leftVisData = upperVisData(leftVis.yAxis.axisLabel(), leftVis.xAxis.axisLabel(), phillipsCurve());
        middleVisData = upperVisData(middleVis.yAxis.axisLabel(), middleVis.xAxis.axisLabel(), lafferCurve());
        rightVisData = upperVisData(rightVis.yAxis.axisLabel(), rightVis.xAxis.axisLabel(), ISLMCurve());
    }
    else {
        leftVisData = data;

    }
    //rightVis.data = rightVisData;
    //console.log(rightVisData);
    d3.select('#leftvis svg').datum(leftVisData);
    d3.select('#middlevis svg').datum(middleVisData);
    d3.select('#rightvis svg').datum(rightVisData);
    //drawUpperVisualisations();
    leftVis.update();
    middleVis.update();
    rightVis.update();
}
function NormaliseMode() {
    //TODO change teh maindata loading so that it loads the data seperatly from the drawing and then just pass in
    //TODO the actual data variable. This allows for normalisation to work and not need to get data every time.
    if (!isMainNormalised && Normalisedmaindata == null) {
        console.log('calculating normalisation values');
        Normalisedmaindata = [];
        unNormalisedmaindata.forEach(function (series, seriesi) {
            Normalisedmaindata.push({'key': series.key, 'values': [], 'disabled': series.disabled});
            var max = //d3.format(tickformat)(
                    d3.max(series.values, function (d) {
                        return parseFloat(d.y)
                    })
            // )
                ;
            var min = //d3.format(tickformat)(
                    d3.min(series.values, function (d) {
                        return parseFloat(d.y)
                    })
            //)
                ;
            //console.log('k: ' + series.key + ' min: ' + min + ' max: ' + max);
            series.values.forEach(function (s, i) {
                if (s.y == "") return;
                var x = s.x;
                var y = //d3.format(tickformat)(
                        s.y//)
                    ;
                y = d3.format(tickformat)(
                    (y - min) / (max - min))
                ;
                Normalisedmaindata[seriesi].values.push({x: x, 'y': y});
            });
        });
    }
    console.log('Normalised: ' + isMainNormalised);
    if (isMainNormalised)maindata = unNormalisedmaindata;
    else maindata = Normalisedmaindata;
    drawmain(maindata);
    isMainNormalised = !isMainNormalised;

}
function BackgroundColour() {
    var topcolour = d3.rgb("#c9c9c0");
    var maincolour = d3.rgb(255, 250, 0);
    if (backgroundcolour) {
        topcolour = d3.rgb(255, 255, 255);
        maincolour = d3.rgb(255, 255, 255);
    }
    d3.select('#main').style('background-color', maincolour);
    d3.selectAll('.topvis').style('background-color', topcolour);
    backgroundcolour = !backgroundcolour;
}

function spendingVsDebt() {
    var keywords = ['Debt', 'Spending'];
    setSeries(keywords);
}
function search() {
    var text = document.getElementById('searchbox').value.split(', ');
    console.log('searching for: ' + text + '|');
    if (text != '')setSeries(text);
}
/*Set the series that will be displayed. input is a list of keywords*/
function setSeries(keywords) {
    if (keywords == undefined || keywords[0] == '') return;
    console.log(keywords);
    var state = {disabled: []};
    maindata.forEach(function (series, i) {
        state.disabled.push(function (kws) {
            //var match = false;
            if (kws[0].toString().toLowerCase() == 'all')return false;
            for (var index in kws) {
                var key = series.key.toLowerCase();
                var keyword = kws[index].toString();
                console.log(key + '   ' + keyword + ' ' + index + ' ' + keyword.toLowerCase());
                if (key.indexOf(keyword.toLowerCase()) >= 0) { //console.log(kws[keyword]+'  '+(series.key.indexOf(kws[keyword]) >= 0)+' '+series.key);
                    return false;
                }
            }
            ;
            return true;
        }(keywords));
    });
    //console.log(state);
    mainVis.dispatch.changeState(state);
}

//TOP RIGHT CHART
//Draw the top left visualisation
function drawleftvis(leftAxis, bottomAxis) {
    removeGraph('leftvis', leftVis);
    leftVisData = upperVisData(leftAxis, bottomAxis, phillipsCurve());
    drawUpperVis('leftvis', leftAxis, bottomAxis, leftVisData);
}

//Draw the top middle visualisation
function drawmiddlevis(leftAxis, bottomAxis) {
    removeGraph('middlevis', middleVis);
    middleVisData = upperVisData(leftAxis, bottomAxis, lafferCurve());
    drawUpperVis('middlevis', leftAxis, bottomAxis, middleVisData);
}

//Draw the top right visualisation
function drawrightvis(leftAxis, bottomAxis) {
    removeGraph('rightvis', rightVis);
    rightVisData = upperVisData(leftAxis, bottomAxis, ISLMCurve());
    drawUpperVis('rightvis', leftAxis, bottomAxis, rightVisData);
}

/*A asynchronous callback wrapper. This makes the upper visualisations wait for the main visualisation to be drawn*/
function drawUpperVisualisations() {
    drawleftvis('Inflation (CPI) %', 'Unemployment %');
    drawmiddlevis('Tax Rev, GDP %', 'Income Tax Rate, avg %');
    drawrightvis('Interest Rate %', 'Real GDP, billions £');
}
function drawUpperVis(visid, leftLabel, bottomLabel, data) {
    nv.addGraph(function () {
        console.log('drawing ' + visid);
        var chart = nv.models.lineChart();
        chart.tooltips(true);
        chart.xAxis.tickFormat(d3.format(tickformat)).tickValues([]);
        chart.yAxis.tickFormat(d3.format(tickformat)).tickValues([]);
        chart.yAxis.tickValues([]).showMaxMin(true);
        chart.showLegend(false);
        chart.y(function (d) {
            if (d.y == "") return null;
            return parseFloat(d.y)
        });
        chart.x(function (d) {
            if (d.y == "") return null;
            return parseFloat(d.x)
        });
        //chart.interpolate('linear-closed');
        //chart.pointShape('cross');
        if (leftLabel != null)chart.yAxis.axisLabel(leftLabel).axisLabelDistance(-30);
        if (bottomLabel != null)chart.xAxis.axisLabel(bottomLabel).axisLabelDistance(-17);
        chart.tooltipContent(function (key, x, y, e, graph) {
            var RGB = e.series.color;
            var alpha = '0.35';
            var year = ValueIndexList[leftLabel][y];
            if (year == undefined) year = ValueIndexList[bottomLabel][x];
            var backgroundcolor = 'rgba(' + parseInt(RGB.substring(1, 3), 16) + ',' +
                parseInt(RGB.substring(3, 5), 16) + ',' +
                parseInt(RGB.substring(5, 7), 16) + ',' + alpha + ')';
            var content = '<div class="toptooltiptitle" style="background-color: ';
            content += backgroundcolor + '">';
            content += key + '</div><p>' + leftLabel + ': ' + y + ',<br> ' + bottomLabel + ': ' + x;
            content += '<br> Year: ' + ValueIndexList[leftLabel][y] + '</p>';
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
                if (series.key == leftLabel)inflationIndex = i;
                if (series.key == bottomLabel)unemploymentIndex = i;
            });
            //console.log('  x:'+ x+' '+' y:'+ y+' vind:'+ValueIndexList[leftLabel][y]+' xindex: '+ ValueIndexList[bottomLabel][x]);
            if (mainVis != null)mainVis.lines.highlightPoint(inflationIndex, ValueIndexList[leftLabel][y] - mainMinVal, true);
            if (mainVis != null)mainVis.lines.highlightPoint(unemploymentIndex, ValueIndexList[bottomLabel][x] - mainMinVal, true);
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
    if (unNormalisedmaindata == null) return;
    //console.log('drawing scatter phillips');
    unNormalisedmaindata.forEach(function (series, i) {
        if (series.key == leftAxis)inflationSeries = series.values;
        if (series.key == bottomAxis)unemploymentSeries = series.values;
    });
    var first = false;
    for (var i = 0; i < unemploymentSeries.length; i++) {
        if ((navigationIndexes[0] <= parseInt(unemploymentSeries[i].x) && parseInt(unemploymentSeries[i].x) <= navigationIndexes[1]) || !navigationFilter) {
            //console.log((navigationIndexes[0]<=parseInt(unemploymentSeries[i].x) &&parseInt(unemploymentSeries[i].x)<=navigationIndexes[1]));
            //console.log(navigationIndexes[0]+!!(navigationIndexes[0]<=parseInt(unemploymentSeries[i].x))+'  '+unemploymentSeries[i].x+'  '+navigationIndexes[1]);
            var unemploymentVal = unemploymentSeries[i].y, inflationVal = inflationSeries[i].y;
            //console.log({x:unemploymentVal, y:inflationVal});
            if (unemploymentVal != '' && inflationVal != '') {
                if (first == false) {
                    unemploymentStartIndex = unemploymentSeries[i].x;
                    first = !first;
                }
                historicPhillipsCurve.push({x: unemploymentVal, y: inflationVal, shape: 'circle'});
            }
        } //else{console.log((navigationIndexes[0]<=parseInt(unemploymentSeries[i].x) &&parseInt(unemploymentSeries[i].x)<=navigationIndexes[1]));}
    }
    //console.log(historicPhillipsCurve); console.log(unemploymentSeries.length);
    var data = [
//area: true,
        {
            values: historicPhillipsCurve,
            key: "Historic Values",
            color: "#2ca02c",
            startXIndex: unemploymentStartIndex
        },
        {
            values: [],
            key: "disabled",
            color: "#cccccc"
        }
    ];
    theoreticalCurve.forEach(function (curve) {
        data.push(curve);
    });
    return data;
}

function phillipsCurve() {
    var curve = [];
    for (var i = 1; i < 25; i++) {
        var y = Math.round(100 * ((1 / (i)) * 30 - 5)) / 100;
        //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
        curve.push({x: i, y: y == 0 ? 0.01 : y});
    }
    return [{
        values: curve,
        key: "Phillips Curve",
        color: "#0000CD"
    }];
}

function lafferCurve() {
    var curve = [];
    for (var i = 0; i < 101; i++) {
        var iShift = i - 50;
        var y = (-Math.pow((iShift) / 10, 2) + 40);
        y = Math.round(100 * y) / 100; //round the value
        //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
        curve.push({x: i, y: y < 0 ? 0 : y});
    }
    return [{
        values: curve,
        key: "Laffer Curve",
        color: "#0000CD"
    }];
}

function ISLMCurve() {
    var IScurve = [], LMcurve = [];
    for (var i = 0; i < 1445; i = i + 20) {
        var iShift = i;
        var ISy = Math.round(100 * (-0.008 * i + 11)) / 100;
        var LMy = Math.round(100 * (0.008 * i)) / 100;
        //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
        IScurve.push({x: i, y: ISy == 0 ? 0.01 : ISy});
        LMcurve.push({x: i, y: LMy == 0 ? 0.01 : LMy});
    }
    return [{
        values: IScurve,
        key: "IS Curve",
        color: "#0000CD"
    }, {
        values: LMcurve,
        key: "LM Curve",
        color: "#0000CD"
    }];
}