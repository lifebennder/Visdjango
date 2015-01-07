//$(function() {

//main visualisation global variables.
var mainchart;
var maindata;
var mainfocus = false;
window.onload = function (e) {
    nv.log('loaded');
    drawmain(mainfocus, true, true);
    drawleftvis();
    drawmiddlevis();
    drawrightvis();
};


function drawmain(focus, interactive, tooltips) {
    d3.json("/vis/main_data/", function (error, data) {
        removeGraph('main');
        nv.addGraph(function () {
            var chart;
            if (focus) {
                chart = nv.models.lineWithFocusChart().margin({left: 60});
                chart.y2Axis.tickFormat(d3.format('f'));
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
            chart.xAxis
                .tickFormat(d3.format('f'));
            chart.yAxis
                .tickFormat(d3.format('f'));
            chart.yAxis.axisLabel('£ Thousands').axisLabelDistance(-10);
            chart.clipEdge(true);
            chart.y(function (d) {
                return parseFloat(d.y)
            });
            chart.x(function (d) {
                return parseFloat(d.x)
            });
            chart.tooltips(tooltips);
            console.log('drawing main, interactive tooltip: ' + interactive + ' tooltip:' + tooltips);
            d3.select('#main svg')
                .datum(data)
                .transition()//.duration(300)
                .call(chart);
            nv.utils.windowResize(chart.update);
            mainchart = chart;
            maindata = data;
            return chart;
        });
    });
}
function removeGraph(graph) {
    d3.selectAll("#" + graph + " svg > *").remove();
}
function setInteractiveMode() {
    console.log("setting interactive   ");
    removeGraph('main');
    if (mainfocus) {
        mainfocus = !mainfocus;
        drawmain(mainfocus, true, true);
    }
    if (mainchart.useInteractiveGuideline() == true) {
        console.log('interactive in true:   ' + mainchart.useInteractiveGuideline());
        drawmain(mainfocus, false, true);
    } else {
        console.log('interactive is false');
        drawmain(mainfocus, true, true);
    }
}

function setFocusMode() {
    console.log("setFocus Mode");
    removeGraph('main');
    mainfocus = !mainfocus;
    drawmain(mainfocus, false, true);
}

function NormaliseMode() {

}

//TOP RIGHT CHART
//Draw the top left visualisation
function drawleftvis() {
    drawUpperVis('leftvis');
}

//Draw the top left visualisation
function drawmiddlevis() {
    drawUpperVis('middlevis');
}

//Draw the top left visualisation
function drawrightvis() {
    drawUpperVis('rightvis');
}

function drawUpperVis(visid) {
    nv.addGraph(function () {
        var chart = nv.models.lineChart();
        chart.xAxis.tickFormat(d3.format('f'));
        chart.yAxis.tickFormat(d3.format('f'));
        chart.yAxis.showMaxMin(true).axisLabel('Left').axisLabelDistance(-30);
        chart.xAxis.axisLabel('Bottom').axisLabelDistance(-10);
        chart.xAxis.ticks(false);

        chart.width(parseInt(d3.select('#leftvis').style('width')));
        chart.height(parseInt(d3.select('#leftvis').style('height')));
        chart.tooltipContent(function (key, y, e, graph) {
            var content = '<h3 style="background-color: ';
            content += e.color + '">';
            content += '</h3><p>' + y + '</p>';
            return content;
        });
        chart.margin({"left": 30, "right": 30, "top": 15, "bottom": 28});
        chart.options({
            useInteractiveGuideLines: true
            , showLegend: false
            , title: 'Phillips Curve'
            //,showYAxis : false
            //,showXAxis : false
        });
        d3.select('#' + visid + ' svg').datum(sinAndCos()).call(chart);
    });
}
function sinAndCos() {
    var sin = [],
        phillips = [],
        rand = [],
        rand2 = []
        ;

    for (var i = 0; i < 50; i++) {
        //sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i / 10)}); //the nulls are to show how defined works
        phillips.push({x: i, y: (1 / i) > 100 ? null : (1 / i)});
        //rand.push({x: i, y: Math.random() / 10});
//rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
    }
    return [

//area: true,
        {
            values: phillips,
            key: "Cosine Wave",
            color: "#2ca02c"
        },
        /*{
         values: sin,
         key: "Sine Wave",
         color: "#ff7f0e"
         },

         {
         values: rand,
         key: "Random Points",
         color: "#2222ff"
         }
         ,
         {
         values: rand2,
         key: "Random Cosine",
         color: "#667711"
         }*/
    ];
}