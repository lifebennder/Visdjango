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
var buttonSelectID = null;
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
    $('[data-toggle="tooltip"]').tooltip({trigger: 'hover', 'placement': 'bottom', delay: {"show": 800, "hide": 100}}); //activate tooltip plugin
    removeGraph('main', mainVis);
    removeGraph('leftvis', leftVis);
    removeGraph('middlevis', middleVis);
    removeGraph('rightvis', rightVis);

    d3.json("/vis/main_data/", function (error, data) {
        unNormalisedmaindata = data;
        maindata = unNormalisedmaindata;
        drawmain(maindata);
    });
    d3.select('#startfooter').transition().delay(1500).duration(3000).ease("elastic").style("opacity", 1);
    BackgroundColour();
    nv.log('loaded');
    //drawmain(mainfocus, true, true);
    //drawUpperVisualisations();

};
function hide(id) {
    d3.select('#' + id).transition().delay(100).duration(1500).style("opacity", 0).remove();
}
function drawmain(data) {
    //d3.json("/vis/main_data/", function (error, data) {
    //removeGraph('main', mainVis);
    nv.addGraph(function () {
        var chart;
        if (mainfocus) {
            chart = nv.models.lineWithFocusChart().margin({left: 60});
            chart.y2Axis.tickFormat(d3.format(tickformat));
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
                    chart.useVoronoi(false);
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
        //chart.xDomain([1600,2019]);
        chart.yAxis.tickFormat(d3.format(tickformat));
        chart.useInteractiveGuideline(maininteractive);
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
            if (d == null || d.y == "") return null;
            //var yy = d3.format(tickformat)(d.y);
            return parseFloat(d.y)
        });

        chart.x(function (d) {
            if (d == null || d.x == "") return null;
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
                    //console.log(e.pointXValue);
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
            updateData(newState);// console.log(newState.disabled);
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
    //console.log(newState);
    //console.log(mainVis.state);
    newState.disabled.forEach(function (disabled, i) {
        if (Normalisedmaindata != null)Normalisedmaindata[i].disabled = disabled;
        else {
            console.log('normalised is null');
        }
        unNormalisedmaindata[i].disabled = disabled;
    });
    //mainVis.legend.update(maindata);
    //mainVis.update(maindata);
}
/*function getindexes(data) {
 data.forEach(function (series, i) {
 if (!series.key.indexOf('Inflation'))inflationIndex = i;
 if (!series.key.indexOf('Unemployment'))unemploymentIndex = i;
 });
 }*/
function removeGraph(graph, chartobject) {

    if (chartobject != undefined && chartobject != null) {
        chartobject.tooltips(false);
        if (chartobject.useInteractiveGuideline != undefined)chartobject.useInteractiveGuideline(false);
    }
    d3.selectAll("#" + graph + " svg > *").remove();
}
function setInteractiveMode() {
    console.log("setting interactive   ");
    //removeGraph('main');
    //TODO MAYBE REMOVE THIS
    removeGraph('main', mainVis);
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
function changeButtonColourClass(id, isOn, onClass, offClass) {
    var text = d3.select(id).text();
    var lastIndex = -1;// = oldText.lastIndexOf(" ");
    if (text.indexOf(' Off') > 0) {
        text = text.replace(' Off', ' On');
    }
    else text = text.replace(' On', ' Off');
    if (isOn) {
        d3.select(id).classed(offClass, false);
        d3.select(id).classed(onClass, true);
    }
    else {
        d3.select(id).classed(onClass, false);
        d3.select(id).classed(offClass, true);
    }
    if (text.indexOf(' Off') > 0 || text.indexOf(' On') > 0) {
        d3.select(id).text(text);
        d3.select(id).style({'font-size': 'calc(50% + 0.8vw)'});
    }
}
function setFocusMode() {
    console.log("setFocus Mode");
    removeGraph('main', mainVis);
    mainfocus = !mainfocus;
    changeButtonColourClass('#setfocusmode', mainfocus, 'btn-info', 'btn-default');//,'Navigation Bar On','Navigation Bar Off');
    /* if(mainfocus) {
     d3.select('#setfocusmode').classed('btn-danger',false);
     d3.select('#setfocusmode').classed('btn-info',true);
     }
     else {
     d3.select('#setfocusmode').classed('btn-info',false);
     d3.select('#setfocusmode').classed('btn-danger',true);
     }*/

    drawmain(maindata);
}
function navigationFilterToggle() {
    navigationFilter = !navigationFilter;
    changeButtonColourClass('#navigationfiltertoggle', navigationFilter, 'btn-info', 'btn-default');
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
                //if (s.y == "") {return;}
                var x = s.x;
                var y = //d3.format(tickformat)(
                        s.y//)
                    ;
                if (y != "")y = d3.format(tickformat)(
                    (y - min) / (max - min));
                Normalisedmaindata[seriesi].values.push({x: x, 'y': y});
            });
        });
    }
    console.log('Normalised: ' + isMainNormalised);
    if (isMainNormalised)maindata = unNormalisedmaindata;
    else maindata = Normalisedmaindata;
    //console.log(maindata);
    d3.select('#main svg ').datum(maindata);
    var wrap = d3.select('#main svg ').selectAll('g.nv-wrap.nv-lineChart').data([maindata]);
    var g = wrap.select('g');
    g.select('.nv-legendWrap').select('g.nv-legend')
        .datum(maindata);//.transition().call(mainVis.legend);
    //g.selectAll('.nv-series').datum([maindata]);
    mainVis.legend.update(maindata);
    mainVis.update(maindata);
    //drawmain(maindata);
    isMainNormalised = !isMainNormalised;
    changeButtonColourClass('#normalisemode', isMainNormalised, 'btn-info', 'btn-default');
}
function BackgroundColour() {
    backgroundcolour = !backgroundcolour;
    var topcolour = d3.rgb("#c9c9c0");
    var maincolour = d3.rgb(255, 250, 0);
    if (!backgroundcolour) {
        topcolour = d3.rgb(255, 255, 255);
        maincolour = d3.rgb(255, 255, 255);
    }
    d3.select('#main').style('background-color', maincolour);
    d3.selectAll('.topvis').style('background-color', topcolour);

    changeButtonColourClass('#backgroundcolour', backgroundcolour, 'btn-info', 'btn-default');
}
function FancyVis(id) {
    var istrue = (d3.select('#' + id).property('className').indexOf('btn-info') >= 0);
    d3.select('#leftvis').classed({'with-3d-shadow': !istrue, 'with-transitions': !istrue});
    d3.select('#middlevis').classed({'with-3d-shadow': !istrue, 'with-transitions': !istrue});
    d3.select('#rightvis').classed({'with-3d-shadow': !istrue, 'with-transitions': !istrue});
    d3.select('#main').classed({'with-3d-shadow': !istrue, 'with-transitions': !istrue});
    changeButtonColourClass('#' + id, !istrue, 'btn-info', 'btn-default');
}

function search() {
    var text = document.getElementById('searchbox').value.split(', ');
    console.log('searching for: ' + text + '|');
    if (text != '' && text != null)setSeries(text);
}
/*Set the series that will be displayed. input is a list of keywords*/
function setSeries(keywords, id) {
    if (keywords == undefined || keywords[0] == '') return;
    //console.log(id);
    var state = {disabled: []};
    maindata.forEach(function (series, i) {
        state.disabled.push(function (kws) {
            //var match = false;
            if (kws[0].toString().toLowerCase() == 'all')return false;
            for (var index in kws) {
                var key = series.key.toLowerCase();
                var keyword = kws[index].toString();
                //console.log(key + '   ' + keyword + ' ' + index + ' ' + keyword.toLowerCase());
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
    //if(d3.select('#'+id).property('className').indexOf('btn-info')){

    if (buttonSelectID != null) {
        var istrue = (d3.select('#' + buttonSelectID).property('className').indexOf('btn-info') >= 0);
        console.log(buttonSelectID + ' setting false ' + istrue);
        changeButtonColourClass('#' + buttonSelectID, false, 'btn-info', 'btn-default');
        buttonSelectID = null;
    }

    if (id != undefined) {
        console.log(id + ' setting true');
        buttonSelectID = id;
        //d3.select('#'+id).property('className').indexOf('btn-info')>=0
        changeButtonColourClass('#' + id, true, 'btn-info', 'btn-default');
    }
    //}
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
            if (d == null || d.y == "") return null;
            return parseFloat(d.y)
        });
        chart.x(function (d) {
            if (d == null || d.x == "") return null;
            return parseFloat(d.x)
        });
        chart.useVoronoi(false);
        //chart.useInteractiveGuideline(true);
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
        chart.interactiveLayer.dispatch.on('elementMousemove.upper', function (e) {
            console.log(e);
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
        if ((navigationIndexes[0] <= parseInt(unemploymentSeries[i].x) && parseInt(unemploymentSeries[i].x) <= navigationIndexes[1]) || !navigationFilter || !mainfocus) {
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
        }/*,
         {
         values: [],
         key: "disabled",
         color: "#cccccc"
         }*/
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