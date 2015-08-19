//main visualisation global variables.
var mainVis = null;
var maindata = null;
var unNormalisedmaindata = null;
var Normalisedmaindata = null;
var mainfocus = false;
var maininteractive = true;
var maintooltips = true;
var tickformat = '.2f';
var currency = '£';//'Kč';
var country = 'unitedkingdom';//'czechrepublic';
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
var visheight = null;
/*window.onload = function (e) {
    loadpage();
    //console.log(correctAnswers);
    d3.json("/vis/data/quizanswers/", function (error, data) {
        //console.log(correctAnswers);
        correctAnswers = data;
    });

};*/

function loadvlad() {
    d3.text("/vis/data/vlad", function (error, data) {
        if (data == undefined) return;
        d3.selectAll('#main').html(data);
    });
}

window.onload = function (e) {
    var testdata = [
        {
            "key": "Quantity",
            "bar": true,
            "values": [[1136005200000, 1271000.0], [1138683600000, 1271000.0], [1141102800000, 1271000.0], [1143781200000, 0], [1146369600000, 0], [1149048000000, 0], [1151640000000, 0], [1154318400000, 0], [1156996800000, 0], [1159588800000, 3899486.0], [1162270800000, 3899486.0], [1164862800000, 3899486.0], [1167541200000, 3564700.0], [1170219600000, 3564700.0], [1172638800000, 3564700.0], [1175313600000, 2648493.0], [1177905600000, 2648493.0], [1180584000000, 2648493.0], [1183176000000, 2522993.0], [1185854400000, 2522993.0], [1188532800000, 2522993.0], [1191124800000, 2906501.0], [1193803200000, 2906501.0], [1196398800000, 2906501.0], [1199077200000, 2206761.0], [1201755600000, 2206761.0], [1204261200000, 2206761.0], [1206936000000, 2287726.0], [1209528000000, 2287726.0], [1212206400000, 2287726.0], [1214798400000, 2732646.0], [1217476800000, 2732646.0], [1220155200000, 2732646.0], [1222747200000, 2599196.0], [1225425600000, 2599196.0], [1228021200000, 2599196.0], [1230699600000, 1924387.0], [1233378000000, 1924387.0], [1235797200000, 1924387.0], [1238472000000, 1756311.0], [1241064000000, 1756311.0], [1243742400000, 1756311.0], [1246334400000, 1743470.0], [1249012800000, 1743470.0], [1251691200000, 1743470.0], [1254283200000, 1519010.0], [1256961600000, 1519010.0], [1259557200000, 1519010.0], [1262235600000, 1591444.0], [1264914000000, 1591444.0], [1267333200000, 1591444.0], [1270008000000, 1543784.0], [1272600000000, 1543784.0], [1275278400000, 1543784.0], [1277870400000, 1309915.0], [1280548800000, 1309915.0], [1283227200000, 1309915.0], [1285819200000, 1331875.0], [1288497600000, 1331875.0], [1291093200000, 1331875.0], [1293771600000, 1331875.0], [1296450000000, 1154695.0], [1298869200000, 1154695.0], [1301544000000, 1194025.0], [1304136000000, 1194025.0], [1306814400000, 1194025.0], [1309406400000, 1194025.0], [1312084800000, 1194025.0], [1314763200000, 1244525.0], [1317355200000, 475000.0], [1320033600000, 475000.0], [1322629200000, 475000.0], [1325307600000, 690033.0], [1327986000000, 690033.0], [1330491600000, 690033.0], [1333166400000, 514733.0], [1335758400000, 514733.0]]
        },
        {
            "key": "Price",
            "values": [[1136005200000, 71.89], [1138683600000, 75.51], [1141102800000, 68.49], [1143781200000, 62.72], [1146369600000, 70.39], [1149048000000, 59.77], [1151640000000, 57.27], [1154318400000, 67.96], [1156996800000, 67.85], [1159588800000, 76.98], [1162270800000, 81.08], [1164862800000, 91.66], [1167541200000, 84.84], [1170219600000, 85.73], [1172638800000, 84.61], [1175313600000, 92.91], [1177905600000, 99.8], [1180584000000, 121.191], [1183176000000, 122.04], [1185854400000, 131.76], [1188532800000, 138.48], [1191124800000, 153.47], [1193803200000, 189.95], [1196398800000, 182.22], [1199077200000, 198.08], [1201755600000, 135.36], [1204261200000, 125.02], [1206936000000, 143.5], [1209528000000, 173.95], [1212206400000, 188.75], [1214798400000, 167.44], [1217476800000, 158.95], [1220155200000, 169.53], [1222747200000, 113.66], [1225425600000, 107.59], [1228021200000, 92.67], [1230699600000, 85.35], [1233378000000, 90.13], [1235797200000, 89.31], [1238472000000, 105.12], [1241064000000, 125.83], [1243742400000, 135.81], [1246334400000, 142.43], [1249012800000, 163.39], [1251691200000, 168.21], [1254283200000, 185.35], [1256961600000, 188.5], [1259557200000, 199.91], [1262235600000, 210.732], [1264914000000, 192.063], [1267333200000, 204.62], [1270008000000, 235.0], [1272600000000, 261.09], [1275278400000, 256.88], [1277870400000, 251.53], [1280548800000, 257.25], [1283227200000, 243.1], [1285819200000, 283.75], [1288497600000, 300.98], [1291093200000, 311.15], [1293771600000, 322.56], [1296450000000, 339.32], [1298869200000, 353.21], [1301544000000, 348.5075], [1304136000000, 350.13], [1306814400000, 347.83], [1309406400000, 335.67], [1312084800000, 390.48], [1314763200000, 384.83], [1317355200000, 381.32], [1320033600000, 404.78], [1322629200000, 382.2], [1325307600000, 405.0], [1327986000000, 456.48], [1330491600000, 542.44], [1333166400000, 599.55], [1335758400000, 583.98]]
        }
    ].map(function (series) {
            series.values = series.values.map(function (d) {
                return {x: d[0], y: d[1]}
            });
            return series;
        });
    var chart;
    d3.json("/vis/data/" +"vlad/", function (error, data) {
        nv.addGraph(function () {
            chart = nv.models.linePlusBarChart()
                .margin({top: 50, right: 60, bottom: 30, left: 70})
                //.legendRightAxisHint(' [Using Right Axis]')
                .color(d3.scale.category10().range());
            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            })
                .showMaxMin(false);
            chart.y1Axis.tickFormat(function (d) {
                return '$' + d3.format(',f')(d)
            });
            chart.bars.forceY([0]).padData(false);
            chart.x2Axis.tickFormat(function (d) {
                return d3.format(',f')(d)
            }).showMaxMin(false);
            console.log(testdata);
            d3.select('#main svg')
                .datum(testdata)
                .transition().duration(500).call(chart);
            nv.utils.windowResize(chart.update);
            chart.dispatch.on('stateChange', function (e) {
                nv.log('New State:', JSON.stringify(e));
            });
            return chart;
        });

    });
};



















/*the loading function of the whole page*/
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
    d3.json("/vis/data/" +"vlad/", function (error, data) {
        unNormalisedmaindata = data;
        maindata = unNormalisedmaindata;
        Normalisedmaindata = null;
        //if (currencyId != undefined)currency = currencyId;
        //if (data[0].key.indexOf('č') > 0)currency = 'Kč';
        //else currency = '£';
        var keystr = data[0].key;
        currency = keystr.substr(keystr.indexOf('ns ') + 3);
        console.log('Currency: ' + currency);
        //console.log(data);
        drawmain(maindata);
        //if (!isMainNormalised)NormaliseMode();
    });
    loadresource('ref');
    loadresource('quiz');
    loadupperlinks();
    if (isQuiz != undefined && isQuiz)quiz();
    if (newCountry == undefined) {
        d3.select('#startfooter').transition().delay(1500).duration(3000).ease("elastic").style("opacity", 1);
        BackgroundColour('backgroundcolour');
        console.log('loaded');
    }
    //drawmain(mainfocus, true, true);
    //drawUpperVisualisations();
    //if(isQuiz) isQuiz=true;
}
function loadupperlinks() {
    d3.select('#datalinkcsv').attr('href', "/static/" + country + "data.csv");
    d3.select('#datalink').attr('href', "/vis/data/" + country + "data/");
}
function loadresource(resource) {
    d3.text("/vis/data/" + country + resource + "/", function (error, data) {
        if (data == undefined) return;
        d3.selectAll('#' + resource).html(data);
    });
}

/*function that draws the main visualisation*/
function drawmain(data) {
    //removeGraph('main', mainVis);
    nv.addGraph(function () {
        var chart;
        console.log(timeBarIndexes+ " "+ data[0].values[data[0].values.length - 1].x);
        if (timeBarIndexes == undefined) {
            timeBarIndexes = [data[0].values[0].x, data[0].values[data[0].values.length - 1].x];
        }
        else if (timeBarIndexes != undefined) {
            var minX = data[0].values[0].x;
            var maxX = data[0].values[data[0].values.length - 1].x;
            if (timeBarIndexes[0] < minX || timeBarIndexes[0] > maxX)timeBarIndexes[0] = minX;
            if (timeBarIndexes[1] < minX || timeBarIndexes[1] > maxX)timeBarIndexes[1] = maxX;
        }
        if (mainfocus) {
            chart = nv.models.linePlusBarChart().margin({left: 55});
            chart.y2Axis.tickFormat(d3.format(tickformat));
            chart.brushExtent(timeBarIndexes);
        } else {
            chart = nv.models.linePlusBarChart().margin({left: 55});
        }
        chart.xAxis.axisLabel('Wavelength');
        chart.xAxis.tickFormat(d3.format('f'));
        //chart.xDomain([1600,2019]);
        //chart.yAxis.tickFormat(d3.format(tickformat));
        //chart.useInteractiveGuideline(maininteractive);
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
        d3.select('#main svg')
            .datum(data)
            .transition()//.duration(300)
            .call(chart);
        nv.utils.windowResize(chart.update);
        mainVis = chart;
        maindata = data;
        /*Events Handlers*/
        if (chart.interactiveLayer != null) {
            chart.interactiveLayer.dispatch.on('elementMousemove.mainphillips', function (e) {
                if (leftVis != null && middleVis != null && rightVis != null) {
                    leftVis.lines.clearHighlights();
                    middleVis.lines.clearHighlights();
                    rightVis.lines.clearHighlights();
                    var leftPointIndex = Math.round(e.pointXValue) - (leftVisData[0].startXIndex);
                    var middlePointIndex = Math.round(e.pointXValue) - (middleVisData[0].startXIndex);
                    var rightPointIndex = Math.round(e.pointXValue) - (rightVisData[0].startXIndex);
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
        });
        chart.dispatch.on('changeState.main', function (newState) {
            updateData(newState);
        });
        drawUpperVisualisations();
        if (legendState.length > 0 && legendState != undefined) setSeries(legendState, buttonSelectID, true);
        return chart;
    });
}

/*function that happens after the drawing of the upper visualisations. This is to fix the ajax property of d3*/
function upperDrawWait(chart) {
    if (mainfocus) {
        chart.dispatch.on('brush.user', function (brush) {
            //updateData(newState); //brush is returned and extent []
            timeBarIndexes[0] = Math.round(brush.extent[0]);
            timeBarIndexes[1] = Math.round(brush.extent[1]);
            changeStatus();
            if (timeBarFilter) {
                leftVisData = upperVisData(leftVis.yAxis.axisLabel(), leftVis.xAxis.axisLabel(), phillipsCurve(country));
                middleVisData = upperVisData(middleVis.yAxis.axisLabel(), middleVis.xAxis.axisLabel(), lafferCurve(country));
                rightVisData = upperVisData(rightVis.yAxis.axisLabel(), rightVis.xAxis.axisLabel(), ISLMCurve(country));
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
/*makes sure the status for both normalised and unnormalised data is the same*/
function updateData(newState) {
    legendState = [];
    newState.disabled.forEach(function (disabled, i) {
        if (Normalisedmaindata != null)Normalisedmaindata[i].disabled = disabled;
        unNormalisedmaindata[i].disabled = disabled;
        if (!disabled) {
            var str = maindata[i].key.split(" ");
            if (str[str.length - 1] == currency)str = str.slice(0, -2);
            legendState.push(str.join(" "));
        }
    });
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
/*function setInteractiveMode() {
 console.log("setting interactive   ");
 //removeGraph('main');
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
 }*/

/*changes the button colour*/
function changeButtonColourClass(id, isOn, onClass, offClass) {
    var text = d3.select(id).text();
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
        d3.select(id).style({'font-weight': 'bold'});
    }
    changeStatus();
}
/*toggles the time bar button event*/
function setFocusMode() {
    console.log("setFocus Mode");
    removeGraph('main', mainVis);
    mainfocus = !mainfocus;
    changeButtonColourClass('#setfocusmode', mainfocus, 'btn-info', 'btn-default');//,'Navigation Bar On','Navigation Bar Off');
    drawmain(maindata);
}
function navigationFilterToggle() {
    timeBarFilter = !timeBarFilter;
    changeButtonColourClass('#navigationfiltertoggle', timeBarFilter, 'btn-info', 'btn-default');
    setUpperVisData();
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
/*event hanlder for normalisation*/
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
    if (isMainNormalised)maindata = unNormalisedmaindata;
    else maindata = Normalisedmaindata;
    d3.select('#main svg ').datum(maindata);
    var wrap = d3.select('#main svg ').selectAll('g.nv-wrap.nv-lineChart').data([maindata]);
    var g = wrap.select('g');
    g.select('.nv-legendWrap').select('g.nv-legend').datum(maindata);//.transition().call(mainVis.legend);
    mainVis.legend.update(maindata);
    mainVis.update(maindata);
    //drawmain(maindata);
    isMainNormalised = !isMainNormalised;
    if (changeStatus === undefined || changeStatus === true) {
        changeButtonColourClass('#normalisemode', isMainNormalised, 'btn-info', 'btn-default');
    }
}
/*event han;der fpr the background colour change*/
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
    d3.selectAll('.topvis').style('background-color', topcolour);
    changeButtonColourClass('#' + id, backgroundcolour, 'btn-info', 'btn-default');
}
/*toggles high quality visualisations*/
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
/*changes the status of the visualisation. status=the series that are selected*/
function changeStatus() {
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
/*event hanlder for fullscreen button*/
function fullscreen(id, selfid) {
    isFullscreen = !isFullscreen;
    var display = 'inline', width = '64%';
    if (isFullscreen) {
        display = 'none';
        width = '99%';
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-full', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-small', true);
    }
    else {
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-small', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-resize-full', true);
    }
    d3.select('#leftcontrol').style('display', display);
    d3.select('#rightcontrol').style('display', display);
    d3.select('#' + id).style({'width': width, 'margin-left': 'auto', 'margin-right': '0'});
    mainVis.update();
    leftVis.update();
    middleVis.update();
    rightVis.update();
}
/*event hanlder for hiding the upper visualiastions*/
function upperhide(id, selfid) {
    isUpperHidden = !isUpperHidden;
    if (visheight == null) {
        visheight = d3.select('#' + id).style('height');
        console.log(visheight);
    }
    var display = 'block', height = visheight;
    if (isUpperHidden) {
        display = 'none';
        height = '98%';
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-up', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-down', true);
    }
    else {
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-down', false);
        d3.select('#' + selfid + ' span').classed('glyphicon-arrow-up', true);
    }
    d3.select('#upperparent').style('display', display);
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
    var realgdp = 'Real GDP, ';
    unNormalisedmaindata.forEach(function (series, i) {
        if (series.key.indexOf(realgdp) >= 0)realgdp = series.key;

    });
    drawrightvis('Interest Rate, %', realgdp);
}
/*generic function to draw the upper visualisations*/
function drawUpperVis(visid, leftLabel, bottomLabel, data) {
    nv.addGraph(function () {
        var chart = nv.models.historicalBarChart();
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

        if (leftLabel != null)chart.yAxis.axisLabel(leftLabel).axisLabelDistance(-14);
        if (bottomLabel != null)chart.xAxis.axisLabel(bottomLabel).axisLabelDistance(-17);
        chart.tooltipContent(function (key, x, y, e, graph) {
            var RGB = e.series.color;
            var alpha = '0.35';
            var year = e.point.year;
            var backgroundcolor = 'rgba(' + parseInt(RGB.substring(1, 3), 16) + ',' +
                parseInt(RGB.substring(3, 5), 16) + ',' +
                parseInt(RGB.substring(5, 7), 16) + ',' + alpha + ')';
            var content = '<div class="toptooltiptitle" style="background-color: ';
            content += backgroundcolor + '">';
            content += key + '</div><p>' + leftLabel + ': ' + y + ',<br> ' + bottomLabel + ': ' + x;
            if (e.seriesIndex == 0)content += '<br> Year: ' + year + '</p>';
            return content;
        });
        chart.margin({"left": 49, "right": 23, "top": 10, "bottom": 30});
        d3.select('#' + visid + ' svg').datum(data).call(chart);
        nv.utils.windowResize(chart.update);
        if (visid == 'leftvis')leftVis = chart;
        else if (visid == 'middlevis')middleVis = chart;
        else if (visid == 'rightvis') rightVis = chart;

        /*Event Handlers*/
        chart.dispatch.on('tooltipShow.upper', function (e) {
            var mainMinVal = //(maindata[0].values[0].x)
                timeBarIndexes[0];
            var year = e.point.year;
            var inflationIndex;
            var unemploymentIndex;
            maindata.filter(function (series, i) {
                series.seriesIndex = i;
                return !series.disabled;
            }).forEach(function (series, i) {
                if (series.key == leftLabel)inflationIndex = i;
                if (series.key == bottomLabel)unemploymentIndex = i;
            });
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
/*generic function to generate uppervisualisation data*/
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
        }
    }
    var data = [
        {
            values: historicData,
            key: "Historic Values",
            color: "#2ca02c",
            startXIndex: bottomStartIndex
        }
    ];
    theoreticalCurve.forEach(function (curve) {
        data.push(curve);
    });
    return data;
}
/*phillips curve data*/
function phillipsCurve(countryy) {
    var curve = [];
    if (countryy == 'unitedstates') {
        for (var i = 1; i < 13; i++) {
            var y = Math.round(100 * ((1 / (i)) * 30 - 3)) / 100;
            //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
            curve.push({x: i, y: y == 0 ? 0.01 : y});
        }
    }
    else if (countryy == 'czechrepublic') {
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
/*laffer curve data*/
function lafferCurve(countryy) {
    var curve = [];
    if (countryy == 'unitedstates'){
        for (var i = 0; i < 101; i++) {
            var iShift = i - 50;
            var y = (-Math.pow((iShift) / 10, 2) + 22);
            y = Math.round(100 * y) / 100; //round the value
            //console.log('x: '+i+' y: '+y+' '+((1 / (i))*30-5));
            curve.push({x: i, y: y < 0 ? 0 : y});
        }
    }
    else if (countryy == 'czechrepublic') {
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
/*IS-LM model data*/
function ISLMCurve(countryy) {
    var IScurve = [], LMcurve = [];
        if (countryy == 'unitedstates') {
        for (var i = 0; i < 18; i = i + 1) {
            var iShift = i;
            var ISy = Math.round(100 * (-0.9 * i + 15)) / 100;
            var LMy = Math.round(100 * (0.9 * i)) / 100;
            IScurve.push({x: i, y: ISy == 0 ? 0.01 : ISy});
            LMcurve.push({x: i, y: LMy == 0 ? 0.01 : LMy});
        }
    }
    else if (countryy == 'czechrepublic') {
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