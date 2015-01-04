//$(function() {

/*nv.addGraph(function () {
    var chart = nv.models.discreteBarChart()
            .x(function (d) {
                return d.label
            })    //Specify the data accessors.
            .y(function (d) {
                return d.value
            })
            .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
            .tooltips(false)        //Don't show tooltips
            .showValues(true)       //...instead, show the bar value right on top of each bar.
            .transitionDuration(350)
        ;

    /*d3.select('#chart svg')
     .datum(exampleData())
     .call(chart);*/

    //nv.utils.windowResize(chart.update);

    //return chart;

//});
var mainchart;
var maindata;
var mainfocus = false;
window.onload = function(e) {nv.log('loaded');drawmain(mainfocus,true,true);};

function drawmain(focus,interactive,tooltips){
    d3.json("/vis/main_data/", function (error, data) {
    removeGraph('main');
    nv.addGraph(function () {
        var chart;
        if (focus){
            chart = nv.models.lineWithFocusChart().margin({left: 60});
            chart.y2Axis.tickFormat(d3.format('f'));
            chart.useInteractiveGuideline(interactive);
        } else {
            chart = nv.models.lineChart().margin({left: 60});
            chart.useInteractiveGuideline(interactive);
        }
        chart.xAxis.axisLabel('Years');
        chart.xAxis
            .tickFormat(d3.format('f'));
        chart.yAxis
            .tickFormat(d3.format('f'));
        chart.yAxis.axisLabel('£ Thousands').axisLabelDistance(40);
        //chart.yAxis.scale(function(n){return o(n)});
        //chart.forceY([0,d3.max(data)]);
        chart.forceY([0]);
        //chart.y2Axis.tickFormat(d3.format('f'));
        //chart.y2Axis.scale(chart.y);


        chart.tooltips(tooltips);
        //chart.interactive(false);
        //nv.log(chart.forceY()+' '+chart.y);
        nv.log('drawing main, interactive tooltip: '+interactive+' tooltip:'+tooltips);
        //chart.yAxis.scale().domain([0,500]);
        //chart.yDomain = [0,500];
        //chart.yDomain2 = 500;
        //chart.title("Historic Data");
        //nv.log('hello'+chart.yDomain1+' '+chart.yDomain2+' '+chart.yDomain);

        d3.select('#main svg')
            .datum(data)
            .transition().duration(250)
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
    if(mainchart!=null)mainchart.tooltips(false);
}
function setInteractiveMode() {
    nv.log("set interactive   ");
    removeGraph('main');

    if(mainchart.useInteractiveGuideline()==true){
        nv.log('interactive in true:   '+mainchart.useInteractiveGuideline());
        //mainchart.useInteractiveGuideline(false).tooltips(false);
        //mainchart.useInteractiveGuideline(false).tooltips(false);
        drawmain(mainfocus,false,true);
    } else {
        nv.log('interactive is false');
        //mainchart.useInteractiveGuideline(false).tooltips(false);
        drawmain(mainfocus,true,true);
    }

    //d3.select("#data").remove();
    //d3.json("/vis/main_data/", function (error, data) {
        //nv.log(error);

    /*d3.selectAll('#main svg')
         .datum(maindata)
         .transition().duration(100)
         .call(mainchart.tooltips(true));
        //mainchart.useInteractiveGuideline(false).update;*/
    //});

}

function setFocusMode() {
    nv.log("setFocus Mode");
    removeGraph('main');
    mainfocus = !mainfocus;
    drawmain(mainfocus,false,true);
}

function NormaliseMode() {

}