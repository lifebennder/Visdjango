//$(function() {

//main visualisation global variables.
var mainchart;
var maindata;
var mainfocus = true;
window.onload = function(e) {
    nv.log('loaded');
    drawmain(mainfocus,true,true);
    drawtopleft();};


function drawmain(focus,interactive,tooltips){
    d3.json("/vis/main_data/", function (error, data) {
    removeGraph('main');
    nv.addGraph(function () {
        var chart;
        if (focus){
            chart = nv.models.lineWithFocusChart().margin({left: 60});
            chart.y2Axis.tickFormat(d3.format('f'));
            //chart.useInteractiveGuideline(interactive);
        } else {
            chart = nv.models.lineChart().margin({left: 60});
            chart.useInteractiveGuideline(interactive);
        }
        console.log('Main width: '+parseInt(d3.select('#main').style('width'))+' height: '+parseInt(d3.select('#main').style('height')));
        //chart.width(parseInt(d3.select('#main').style('width')));
        //chart.height(parseInt(d3.select('#main').style('height')));
        chart.xAxis.axisLabel('Years');
        chart.xAxis
            .tickFormat(d3.format('f'));
        chart.yAxis
            .tickFormat(d3.format('f'));
        chart.yAxis.axisLabel('£ Thousands').axisLabelDistance(-10);
        chart.clipEdge(true);
        chart.y(function(d) { return parseFloat(d.y) });
        chart.tooltips(tooltips);
        console.log('drawing main, interactive tooltip: '+interactive+' tooltip:'+tooltips);
        d3.select('#main svg')
            .datum(data)
            .transition().duration(300)
            .call(chart);
        nv.utils.windowResize(chart.update);
        mainchart = chart;
        maindata = data;
        return chart;
    });
});
}
function removeGraph(graph){
     d3.selectAll("#"+graph+" svg > *").remove();
}
function setInteractiveMode() {
    console.log("set interactive   ");
    removeGraph('main');
    if(mainchart.useInteractiveGuideline()==true){
        console.log('interactive in true:   '+mainchart.useInteractiveGuideline());
        drawmain(mainfocus,false,true);
    } else {
        console.log('interactive is false');
        drawmain(mainfocus,true,true);
    }
}

function setFocusMode() {
    console.log("setFocus Mode");
    removeGraph('main');
    mainfocus = !mainfocus;
    drawmain(mainfocus,false,true);
}

function NormaliseMode() {

}

//TOP RIGHT CHART
//Draw the top left visualisation
function drawtopleft(){
    nv.addGraph(function () {
        //var chart = nv.models.
    });
}

//Draw the top left visualisation
function drawtopmiddle(){

}

//Draw the top left visualisation
function drawtopright(){

}