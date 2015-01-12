//$(function() {

//main visualisation global variables.
var mainchart = null;
var maindata;
var mainfocus = false;
window.onload = function (e) {
    //removeGraph('main',mainchart);
    nv.log('loaded');
    drawmain(mainfocus, false, true);
    drawleftvis();
    drawmiddlevis();
    drawrightvis();
};


function drawmain(focus, interactive, tooltips) {
    d3.json("/vis/main_data/", function (error, data) {
        removeGraph('main',mainchart);
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
                if(d.y=="") return null;
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
            /*chart.dispatch.on('elementMousemove', function(e){
                console.log('element: ');
                //console.dir(e.point);
            });*/
            chart.interactiveLayer.dispatch.on('elementMousemove.maininflation', function(e) {
                //pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
                //console.log(e.point+'  '+'   '+ e.pointXValue+'   '+ e.target);
                var inflationSeries;
                data.forEach(function(series, i){
                    if(series.key.contains('Inflation')) inflationSeries=series.values;
                });
                //console.log('infla  '+inflationSeries[e.pointXValue]);
                //console.log('x  '+ chart.lines);
                //var x = chart.xAxis.tickFormat()(chart.lines.x()(e.point, e.pointIndex)),
                //y = chart.yAxis.tickFormat()(chart.lines.y()(e.point, e.pointIndex));
                //console.log(x+'  '+y);
                 /*data
                    .filter(function(series, i) {
                        series.seriesIndex = i
                         var pointIndex = nv.interactiveBisect(series.values, e.pointXValue, chart.x());
                         //('Inflation (CPI) %')
                         console.log('series: '+ pointIndex+' '+i);
                        return !series.disabled;
                    });*/
                //                        lines.highlightPoint(i, pointIndex, true);
                //if (tooltips) showTooltip(e, that.parentNode);
                //console.log('clicked: '+ e.pointXValue+'  y:'+ e.mouseY+':'+e.mouseX);
            });
            return chart;
        });
    });
}
function removeGraph(graph, chartobject) {
    if( chartobject != null) chartobject.tooltips(false);//chartobject.useInteractiveGuideLines(false);
    d3.selectAll("#" + graph + " svg > *").remove();
}
function setInteractiveMode() {
    console.log("setting interactive   ");
    //removeGraph('main');
    mainchart.tooltips(false);
    if (mainfocus) {
        mainfocus = !mainfocus;
        drawmain(mainfocus, true, true);
    }
    else if (mainchart.useInteractiveGuideline() == true) {
        console.log('interactive is true:   ' + mainchart.useInteractiveGuideline());
        drawmain(mainfocus, false, false);
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
function drawleftvis() {
    drawUpperVis('leftvis','Inflation', 'Unemployment');
}

//Draw the top left visualisation
function drawmiddlevis() {
    drawUpperVis('middlevis','Inflation', 'Unemployment');
}

//Draw the top left visualisation
function drawrightvis() {
    drawUpperVis('rightvis','Inflation', 'Unemployment');
}

function drawUpperVis(visid,leftLabel,bottomLabel) {
    nv.addGraph(function () {
        var chart = nv.models.lineChart();
        chart.xAxis.tickFormat(d3.format('f')).tickValues([]);
        chart.yAxis.tickFormat(d3.format('f')).tickValues([]);
        chart.yAxis.tickValues([]).showMaxMin(true);
        if(leftLabel!=null)chart.yAxis.axisLabel(leftLabel).axisLabelDistance(-30);
        if(bottomLabel!=null)chart.xAxis.axisLabel(bottomLabel).axisLabelDistance(-17);
        chart.xAxis.ticks(true);

        //chart.width(parseInt(d3.select('#' + visid + ' svg').style('width')));
        //chart.height(parseInt(d3.select('#' + visid + ' svg').style('height')));
        chart.tooltipContent(function (key, y, e, graph) {
            var content = '<h3 style="background-color: ';
            content += e.color + '">';
            content += '</h3><p>' + y + '</p>';
            return content;
        });
        chart.margin({"left": 35, "right": 30, "top": 10, "bottom": 30});
        chart.options({
            useInteractiveGuideLines: true
            , showLegend: false
            //,showYAxis : false
            //,showXAxis : false
        });
        d3.select('#' + visid + ' svg').datum(sinAndCos()).call(chart);
        nv.utils.windowResize(chart.update);
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
    ];
}