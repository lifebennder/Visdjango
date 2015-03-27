//main visualisation global variables.
var mainVis = null;
var maindata = null;
var unNormalisedmaindata = null;
var Normalisedmaindata = null;
var mainfocus = false;
var maininteractive = true;
var maintooltips = true;
var tickformat = '.2f';
var currency = 'Kč';//'£';
var country = 'czechrepublic';//'unitedkingdom';
var backgroundcolour = true;
var isMainNormalised = false;
var timeBarIndexes;
var timeBarFilter = true;
var buttonSelectID = null;
var isFullscreen = false;
var isUpperHidden = false;
var legendState = [];
var ValueIndexList = {}; // Data indexes for all the series. accessed using labels
//upper visulisations
var leftVis = null;
var middleVis = null;
var rightVis = null;
var leftVisData = null;
var middleVisData = null;
var rightVisData = null;
window.onload = function (e) {
    loadpage();
                //console.log(correctAnswers);
        d3.json("/vis/data/quizanswers/", function (error, data) {
        //console.log(correctAnswers);
        correctAnswers = data;
    });

};

function loadpage(newCountry, currencyId) {
    $('[data-toggle="tooltip"]').tooltip({trigger: 'hover', 'placement': 'bottom', delay: {"show": 800, "hide": 100}}); //activate tooltip plugin
    removeGraph('main', mainVis);
    removeGraph('leftvis', leftVis);
    removeGraph('middlevis', middleVis);
    removeGraph('rightvis', rightVis);
    //console.log(e);
    //timeBarIndexes = undefined;
    //var countryinput = country;
    if (newCountry != undefined && newCountry != null) country = newCountry;
    d3.json("/vis/data/" + country + "data/", function (error, data) {
        unNormalisedmaindata = data;
        maindata = unNormalisedmaindata;
        Normalisedmaindata = null;
        //if (currencyId != undefined)currency = currencyId;
        //if (data[0].key.indexOf('č') > 0)currency = 'Kč';
        //else currency = '£';
        var keystr = data[0].key;
        currency = keystr.substr(keystr.indexOf('ns ') + 3);
        console.log('Currency: ' + currency);
        drawmain(maindata);
        //if (!isMainNormalised)NormaliseMode();
    });
    loadresource('ref');
    loadresource('quiz');
    loadupperlinks();
    if(isQuiz!= undefined && isQuiz)quiz();
    if (newCountry == undefined) {
        d3.select('#startfooter').transition().delay(1500).duration(3000).ease("elastic").style("opacity", 1);
        BackgroundColour('backgroundcolour');
        console.log('loaded');
    }
    //drawmain(mainfocus, true, true);
    //drawUpperVisualisations();
    //if(isQuiz) isQuiz=true;
}
function loadupperlinks(){
    d3.select('#datalinkcsv').attr('href',"/static/" + country + "data.csv");
    d3.select('#datalink').attr('href',"/vis/data/" + country + "data/");
}
function loadresource(resource) {
    d3.text("/vis/data/" + country + resource + "/", function (error, data) {
        if (data == undefined) return;
        //console.log(d3.select(data)[0][0].innerHTML);//'#document-fragment'));
        //d3.selectAll('#ref').html(d3.select(data)[0][0].innerHTML);;
        d3.selectAll('#' + resource).html(data);
    });
}

function drawmain(data) {
    //removeGraph('main', mainVis);
    nv.addGraph(function () {
        //console.log('focus: ' + mainfocus + ' norm: ' + isMainNormalised);
        var chart;
        if (timeBarIndexes == undefined) {
            timeBarIndexes = [data[0].values[0].x, data[0].values[data[0].values.length - 1].x];
            //console.log(timeBarIndexes + " ");
        }
        else if (timeBarIndexes != undefined) {
            var minX = data[0].values[0].x;
            var maxX = data[0].values[data[0].values.length - 1].x;
            //console.log(timeBarIndexes+(timeBarIndexes[0]<minX||timeBarIndexes[0]>maxX));
            if (timeBarIndexes[0] < minX || timeBarIndexes[0] > maxX)timeBarIndexes[0] = minX;
            if (timeBarIndexes[1] < minX || timeBarIndexes[1] > maxX)timeBarIndexes[1] = maxX;
        }
        if (mainfocus) {
            chart = nv.models.lineWithFocusChart().margin({left: 40});
            chart.y2Axis.tickFormat(d3.format(tickformat));
            //console.log('brush extent setting');
            chart.brushExtent(timeBarIndexes);
        } else {
            chart = nv.models.lineChart().margin({left: 55});
            //chart.useInteractiveGuideline(maininteractive);
        }
        chart.xAxis.axisLabel('Years');
        chart.xAxis.tickFormat(d3.format('f'));
        //chart.xDomain([1600,2019]);
        chart.yAxis.tickFormat(d3.format(tickformat));
        chart.useInteractiveGuideline(maininteractive);

        //chart.yAxis.axisLabel('£ Thousands').axisLabelDistance(-10);
        //chart.clipEdge(true);

        //getindexes(data); // get indexes of all needed series. e.g. index 1 is inflation

        /*unNormalisedmaindata.forEach(function (series, i) {
         ValueIndexList[series.key] = {};
         series.values.forEach(function (values, i) {
         if (values.y == "") return;
         var yy = d3.format(tickformat)(values.y);
         //console.log(value);
         ValueIndexList[series.key][yy] = values.x;
         });
         });*/

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
        //console.log('drawing main, interactive tooltip: ' + maininteractive + ' tooltip:' + maintooltips);
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
                    //leftVis.lines.highlightPoint(1, leftPointIndex, true);
                    middleVis.lines.highlightPoint(0, middlePointIndex, true);
                    //middleVis.lines.highlightPoint(1, middlePointIndex, true);
                    rightVis.lines.highlightPoint(0, rightPointIndex, true);
                    // rightVis.lines.highlightPoint(1, rightPointIndex, true);
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
            if (buttonSelectID != null || buttonSelectID != undefined) {
                changeButtonColourClass('#' + buttonSelectID, false, 'btn-info', 'btn-default');
                buttonSelectID = null;
            }
            //console.log('state change ');
        });
        chart.dispatch.on('changeState.main', function (newState) {
            updateData(newState);
            //console.log('change state');
        });
        drawUpperVisualisations();
        //console.log(legendState+" "+(legendState!=[])+' '+(legendState!= undefined));
        if (legendState.length > 0 && legendState != undefined) setSeries(legendState, buttonSelectID, true);
        return chart;
    });
    //});
}


function upperDrawWait(chart) {
    //console.log('updatingcallback ');
    if (mainfocus) {
        chart.dispatch.on('brush.user', function (brush) {
            //updateData(newState); //brush is returned and extent []
            timeBarIndexes[0] = Math.round(brush.extent[0]);
            timeBarIndexes[1] = Math.round(brush.extent[1]);
            changeStatus();
            if (timeBarFilter) {
                //console.log(country);
                leftVisData = upperVisData(leftVis.yAxis.axisLabel(), leftVis.xAxis.axisLabel(), phillipsCurve(country));
                middleVisData = upperVisData(middleVis.yAxis.axisLabel(), middleVis.xAxis.axisLabel(), lafferCurve(country));
                rightVisData = upperVisData(rightVis.yAxis.axisLabel(), rightVis.xAxis.axisLabel(), ISLMCurve(country));
                //rightVis.data = rightVisData;
                d3.select('#leftvis svg').datum(leftVisData);
                d3.select('#middlevis svg').datum(middleVisData);
                d3.select('#rightvis svg').datum(rightVisData);
                chart.useVoronoi(false);
                //drawUpperVisualisations();
                leftVis.update();
                middleVis.update();
                rightVis.update();
            }
        });
    }
    if (isMainNormalised) {
        isMainNormalised = !isMainNormalised;
        NormaliseMode(false);
    }
}

function updateData(newState) {
    legendState = [];
    newState.disabled.forEach(function (disabled, i) {
        if (Normalisedmaindata != null)Normalisedmaindata[i].disabled = disabled;
        unNormalisedmaindata[i].disabled = disabled;
        if (!disabled) {
            var str = maindata[i].key.split(" ");
            if (str[str.length - 1] == currency)str = str.slice(0, -2);//maindata[i].key.split(" ").slice(0,-2).push(currency);
            //str= str.substring(0, str.lastIndexOf(" "));
            //legendState.push(str.substring(0, str.lastIndexOf(" ")));
            legendState.push(str.join(" "));
        }
    });
    //console.log('update: ' + legendState);
    //mainVis.legend.update(maindata);
    //mainVis.update(maindata);
}
function SelectCountry(id, currencyId) {
    changeButtonColourClass('#' + country, false, 'btn-info', 'btn-default');
    changeButtonColourClass('#' + id, true, 'btn-info', 'btn-default');
    country = id;
    //removeGraph('main', mainVis);
    loadpage(country, currencyId);
}
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
    //var lastIndex = -1;// = oldText.lastIndexOf(" ");
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
    //console.log('befo: '+d3.select(id).style('font-size'));
    if (text.indexOf(' Off') > 0 || text.indexOf(' On') > 0) {
        d3.select(id).text(text);
        d3.select(id).style({'font-weight': 'bold'});
        //d3.select(id).style({'font-size': 'calc(50% + 0.8vw) !important'});
    }
    changeStatus();
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
    timeBarFilter = !timeBarFilter;
    changeButtonColourClass('#navigationfiltertoggle', timeBarFilter, 'btn-info', 'btn-default');
    setUpperVisData();
    //changeStatus();
}

function setUpperVisData(data) {
    if (data == undefined || data == null) {
        leftVisData = upperVisData(leftVis.yAxis.axisLabel(), leftVis.xAxis.axisLabel(), phillipsCurve(country));
        middleVisData = upperVisData(middleVis.yAxis.axisLabel(), middleVis.xAxis.axisLabel(), lafferCurve(country));
        rightVisData = upperVisData(rightVis.yAxis.axisLabel(), rightVis.xAxis.axisLabel(), ISLMCurve(country));
    }
    else {
        leftVisData = data;
    }
    d3.select('#leftvis svg').datum(leftVisData);
    d3.select('#middlevis svg').datum(middleVisData);
    d3.select('#rightvis svg').datum(rightVisData);
    leftVis.update();
    middleVis.update();
    rightVis.update();
}
function NormaliseMode(changeStatus) {
    if (!isMainNormalised && Normalisedmaindata == null) {
        console.log('calculating normalisation values');
        Normalisedmaindata = [];
        unNormalisedmaindata.forEach(function (series, seriesi) {
            Normalisedmaindata.push({'key': series.key, 'values': [], 'disabled': series.disabled});
            var max = d3.max(series.values, function (d) {
                    return parseFloat(d.y)
                })
                ;
            var min = d3.min(series.values, function (d) {
                    return parseFloat(d.y)
                })
                ;
            //console.log('k: ' + series.key + ' min: ' + min + ' max: ' + max);
            series.values.forEach(function (s, i) {
                //if (s.y == "") {return;}
                var x = s.x;
                var y = s.y
                    ;
                if (y != "")y = d3.format(tickformat)(
                    (y - min) / (max - min));
                Normalisedmaindata[seriesi].values.push({x: x, 'y': y});
            });
        });
    }
    //console.log('Normalised: ' + isMainNormalised);
    if (isMainNormalised)maindata = unNormalisedmaindata;
    else maindata = Normalisedmaindata;
    d3.select('#main svg ').datum(maindata);
    var wrap = d3.select('#main svg ').selectAll('g.nv-wrap.nv-lineChart').data([maindata]);
    var g = wrap.select('g');
    g.select('.nv-legendWrap').select('g.nv-legend').datum(maindata);//.transition().call(mainVis.legend);
    //g.selectAll('.nv-series').datum([maindata]);
    mainVis.legend.update(maindata);
    mainVis.update(maindata);
    //drawmain(maindata);
    isMainNormalised = !isMainNormalised;
    if (changeStatus === undefined || changeStatus === true) {
        changeButtonColourClass('#normalisemode', isMainNormalised, 'btn-info', 'btn-default');
    }
}
function BackgroundColour(id) {
    backgroundcolour = !backgroundcolour;
    var topcolour = d3.rgb("#c9c9c0");
    var maincolour = "rgba(0,0,0,0.1)";//d3.rgb(255, 250, 0);
    if (!backgroundcolour) {
        topcolour = d3.rgb(255, 255, 255);
        maincolour = d3.rgb(255, 255, 255);
    }
    d3.select('body').style('background-color', maincolour);
    d3.select('.background').style('background-color', maincolour);
    //d3.select('#mainparent').style('background-color', maincolour);
    d3.selectAll('.topvis').style('background-color', topcolour);
    changeButtonColourClass('#' + id, backgroundcolour, 'btn-info', 'btn-default');
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
function setSeries(keywords, id, useEquals) {
    if (keywords == undefined || keywords == [] || keywords[0] == '') return;
    var state = {disabled: []};
    maindata.forEach(function (series, i) {
        state.disabled.push(function (kws) {
            if (kws[0].toString().toLowerCase() == 'all')return false;
            for (var index in kws) {
                var datakey = series.key.toLowerCase();
                var keyword = kws[index].toString();
                var shortKey = datakey.split(" ");
                if (shortKey[shortKey.length - 1] == currency.toLowerCase())shortKey = shortKey.slice(0, -2).join(" ");
                else shortKey = datakey;//shortKey.join(" ");
                if (useEquals != undefined && useEquals == true) {
                    if (shortKey == keyword.toLowerCase()) return false;
                }
                else if (datakey.indexOf(keyword.toLowerCase()) >= 0) {
                    return false;
                }
            }
            return true;
        }(keywords));
    });
    mainVis.dispatch.changeState(state);
    if (buttonSelectID != null) {
        var istrue = (d3.select('#' + buttonSelectID).property('className').indexOf('btn-info') >= 0);
        changeButtonColourClass('#' + buttonSelectID, false, 'btn-info', 'btn-default');
        buttonSelectID = null;
    }
    if (id != undefined) {
        buttonSelectID = id;
        changeButtonColourClass('#' + id, true, 'btn-info', 'btn-default');
    }
}
function changeStatus() {
    /*var text = "<b>Time Range Bar: </b>"+mainfocus
     +"<b>,&nbsp; Normalised: </b>"+isMainNormalised
     +"<b>,&nbsp; Background Colour: </b>"+backgroundcolour
     +"<b>,&nbsp; Fancy Animation: </b>"+(d3.select('#' + 'fancyvis').property('className').indexOf('btn-info') >= 0);*/
    var text = "Time Range Bar: <b>" + boolToOnOff(mainfocus)
        + "</b>,&nbsp;&nbsp; Time Range Filter: <b>" + boolToOnOff(timeBarFilter)
        + "</b>,&nbsp;&nbsp; Normalised: <b>" + boolToOnOff(isMainNormalised)
        + "</b>,&nbsp;&nbsp; Night Mode: <b>" + boolToOnOff(backgroundcolour)
        + "</b>,&nbsp;&nbsp; High Quality: <b>" + boolToOnOff((d3.select('#' + 'fancyvis').property('className').indexOf('btn-info') >= 0));
    if (mainfocus) text += "</b>,&nbsp;&nbsp; Year Range: <b>" + timeBarIndexes[0] + ':' + timeBarIndexes[1];

    d3.select("#" + 'mainstatus').attr('text-anchor', 'middle').html(text);
}

function boolToOnOff(bool) {
    if (bool) return 'On';
    else return 'Off';
}
function fullscreen(id, selfid) {
    isFullscreen = !isFullscreen;
    var display = 'inline', width = '64%';
    if (isFullscreen) {
        display = 'none';
        width = '100%';
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-full', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-small', true);
    }
    else {
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-small', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-full', true);
    }
    d3.select('#leftcontrol').style('display', display);
    d3.select('#rightcontrol').style('display', display);
    d3.select('#' + id).style('width', width);
    mainVis.update();
    leftVis.update();
    middleVis.update();
    rightVis.update();
}

function upperhide(id, selfid) {
    isUpperHidden = !isUpperHidden;
    var display = 'block', height = '75%';
    if (isUpperHidden) {
        display = 'none';
        height = '100%';
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-up', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-down', true);
    }
    else {
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-down', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-up', true);
    }
    d3.select('#upperparent').style('display', display);
    //d3.select('#middlevis').style('display', display);
    //d3.select('#rightvis').style('display', display);
    d3.select('#' + id).style('height', height);
    mainVis.update();
    leftVis.update();
    middleVis.update();
    rightVis.update();
}

//TOP RIGHT CHART
//Draw the top left visualisation
function drawleftvis(leftAxis, bottomAxis) {
    removeGraph('leftvis', leftVis);
    leftVisData = upperVisData(leftAxis, bottomAxis, phillipsCurve(country));
    drawUpperVis('leftvis', leftAxis, bottomAxis, leftVisData);
}

//Draw the top middle visualisation
function drawmiddlevis(leftAxis, bottomAxis) {
    removeGraph('middlevis', middleVis);
    middleVisData = upperVisData(leftAxis, bottomAxis, lafferCurve(country));
    drawUpperVis('middlevis', leftAxis, bottomAxis, middleVisData);
}

//Draw the top right visualisation
function drawrightvis(leftAxis, bottomAxis) {
    removeGraph('rightvis', rightVis);
    rightVisData = upperVisData(leftAxis, bottomAxis, ISLMCurve(country));
    drawUpperVis('rightvis', leftAxis, bottomAxis, rightVisData);
}

/*A asynchronous callback wrapper. This makes the upper visualisations wait for the main visualisation to be drawn*/
function drawUpperVisualisations() {
    drawleftvis('Inflation, (CPI) %', 'Unemployment, %');
    drawmiddlevis('Tax Rev, GDP %', 'Income Tax Rate, avg %');
    drawrightvis('Interest Rate, %', ('Real GDP, billions ' + currency));
}

function drawUpperVis(visid, leftLabel, bottomLabel, data) {
    nv.addGraph(function () {
        //console.log('drawing ' + visid);
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

        if (leftLabel != null)chart.yAxis.axisLabel(leftLabel).axisLabelDistance(-30);
        if (bottomLabel != null)chart.xAxis.axisLabel(bottomLabel).axisLabelDistance(-17);
        chart.tooltipContent(function (key, x, y, e, graph) {
            var RGB = e.series.color;
            var alpha = '0.35';
            var year = e.point.year;
            //var year = ValueIndexList[leftLabel][y];
            //if (year == undefined) {year = ValueIndexList[bottomLabel][x];}
            var backgroundcolor = 'rgba(' + parseInt(RGB.substring(1, 3), 16) + ',' +
                parseInt(RGB.substring(3, 5), 16) + ',' +
                parseInt(RGB.substring(5, 7), 16) + ',' + alpha + ')';
            var content = '<div class="toptooltiptitle" style="background-color: ';
            content += backgroundcolor + '">';
            content += key + '</div><p>' + leftLabel + ': ' + y + ',<br> ' + bottomLabel + ': ' + x;
            if (e.seriesIndex == 0)content += '<br> Year: ' + year + '</p>';
            return content;
        });
        chart.margin({"left": 40, "right": 30, "top": 10, "bottom": 30});
        d3.select('#' + visid + ' svg').datum(data).call(chart);
        nv.utils.windowResize(chart.update);
        if (visid == 'leftvis')leftVis = chart;
        else if (visid == 'middlevis')middleVis = chart;
        else if (visid == 'rightvis') rightVis = chart;

        /*Event Handlers*/
        chart.dispatch.on('tooltipShow.upper', function (e) {
            var mainMinVal = //(maindata[0].values[0].x)
                timeBarIndexes[0];
            //console.log(timeBarIndexes[0]);
            var year = e.point.year;
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
            //if (mainVis != null)mainVis.lines.highlightPoint(inflationIndex, ValueIndexList[leftLabel][y] - mainMinVal, true);
            //if (mainVis != null)mainVis.lines.highlightPoint(unemploymentIndex, ValueIndexList[bottomLabel][x] - mainMinVal, true);
            if (mainVis != null)mainVis.lines.highlightPoint(inflationIndex, year - mainMinVal, true);
            if (mainVis != null)mainVis.lines.highlightPoint(unemploymentIndex, year - mainMinVal, true);
        });
        chart.dispatch.on('tooltipHide.upper', function (e) {
            mainVis.clearHighlights();
        });

        return chart;
    }, function () { //callback function to be called after the uppver visualisations are drawn
        if (visid == 'rightvis') return upperDrawWait(mainVis);
    });
}

function upperVisData(leftAxis, bottomAxis, theoreticalCurve) {
    var historicData = [], bottomStartIndex,
        leftAxisSeries,
        bottomAxisSeries;
    if (unNormalisedmaindata == null) return;
    unNormalisedmaindata.forEach(function (series, i) {
        if (series.key == leftAxis)leftAxisSeries = series.values;
        if (series.key == bottomAxis) bottomAxisSeries = series.values;

    });
    var first = false;
    for (var i = 0; i < bottomAxisSeries.length; i++) {
        if ((timeBarIndexes[0] <= parseInt(bottomAxisSeries[i].x) && parseInt(bottomAxisSeries[i].x) <= timeBarIndexes[1]) || !timeBarFilter || !mainfocus) {
            var bottomVal = bottomAxisSeries[i].y, leftVal = leftAxisSeries[i].y;
            if (bottomVal != '' && leftVal != '') {
                if (first == false) {
                    bottomStartIndex = bottomAxisSeries[i].x;
                    first = !first;
                }
                historicData.push({
                    x: bottomVal,
                    y: leftVal,
                    year: bottomAxisSeries[i].x,
                    shape: 'circle'
                });
            }
        } //else{console.log((timeBarIndexes[0]<=parseInt(unemploymentSeries[i].x) &&parseInt(unemploymentSeries[i].x)<=timeBarIndexes[1]));}
    }
    var data = [
//area: true,
        {
            values: historicData,
            key: "Historic Values",
            color: "#2ca02c",
            startXIndex: bottomStartIndex
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

function phillipsCurve(countryy) {
    var curve = [];
    if (countryy == 'czechrepublic') {
        for (var i = 1; i < 20; i++) {
            var y = Math.round(100 * ((1 / (i)) * 100  )) / 350;
            //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
            curve.push({x: i, y: y == 0 ? 0.01 : y});
        }
    }
    else {
        for (var i = 1; i < 25; i++) {
            var y = Math.round(100 * ((1 / (i)) * 30 - 5)) / 100;
            //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
            curve.push({x: i, y: y == 0 ? 0.01 : y});
        }
    }
    return [{
        values: curve,
        key: "Phillips Curve",
        color: "#0000CD"
    }];
}

function lafferCurve(countryy) {
    var curve = [];
    if (countryy == 'czechrepublic') {
        for (var i = 0; i < 101; i++) {
            var iShift = i - 50;
            var y = (-Math.pow((iShift) / 10, 2) + 26);
            y = Math.round(100 * y) / 100; //round the value
            //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
            curve.push({x: i, y: y < 0 ? 0 : y});
        }
    }
    else {
        for (var i = 0; i < 101; i++) {
            var iShift = i - 50;
            var y = (-Math.pow((iShift) / 10, 2) + 40);
            y = Math.round(100 * y) / 100; //round the value
            //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
            curve.push({x: i, y: y < 0 ? 0 : y});
        }
    }
    return [{
        values: curve,
        key: "Laffer Curve",
        color: "#0000CD"
    }];
}

function ISLMCurve(countryy) {
    var IScurve = [], LMcurve = [];
    if (countryy == 'czechrepublic') {
        for (var i = 2400; i < 4000; i = i + 30) {
            var iShift = i;
            var ISy = Math.round(100 * (-0.01 * i + 38)) / 100;
            var LMy = Math.round(100 * (0.01 * i - 26)) / 100;
            IScurve.push({x: i, y: ISy == 0 ? 0.01 : ISy});
            LMcurve.push({x: i, y: LMy == 0 ? 0.01 : LMy});
        }
    }
    else {
        for (var i = 0; i < 1445; i = i + 20) {
            var iShift = i;
            var ISy = Math.round(100 * (-0.008 * i + 11)) / 100;
            var LMy = Math.round(100 * (0.008 * i)) / 100;
            IScurve.push({x: i, y: ISy == 0 ? 0.01 : ISy});
            LMcurve.push({x: i, y: LMy == 0 ? 0.01 : LMy});
        }
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