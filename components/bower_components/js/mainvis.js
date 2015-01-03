//$(function() {


function exampleData() {
    return [
        {
            key: "Cumulative Return",
            values: [
                {"label": "A Label", "value": -29.765957771107},
                {"label": "B Label", "value": 500},
                {"label": "C Label", "value": 32.807804682612},
                {"label": "D Label", "value": 196.45946739256},
                {"label": "E Label", "value": 0.19434030906893},
                {"label": "F Label", "value": -98.079782601442},
                {"label": "G Label", "value": -13.925743130903},
                {"label": "H Label", "value": -5.1387322875705}
            ]
        }
    ]
}
function testData() {
    return [
        {
            key: "Cumulative Return",
            values: [
                {"x": 0.0, "y": -29.765957771107},
                {"x": 1.0, "y": -29.765957771107},
                {"x": 2.0, "y": 29.765957771107},
                {"x": 3.0, "y": -29.765957771107},
                {"x": 4.0, "y": -29.765957771107},
                {"x": 5.0, "y": -29.765957771107},
            ]
        }
    ]
}

nv.addGraph(function () {
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

    nv.utils.windowResize(chart.update);

    return chart;

});
d3.json("/vis/main_data/", function (error, data) {
    nv.addGraph(function () {
        var chart = nv.models.lineChart().margin({left: 60}).interactive(true);
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
        chart.useInteractiveGuideline(true).tooltips(true);
        //nv.log(chart.forceY()+' '+chart.y);
        nv.log('hello');
        //chart.yAxis.scale().domain([0,500]);
        //chart.yDomain = [0,500];
        //chart.yDomain2 = 500;
        //chart.title("Historic Data");
        //nv.log('hello'+chart.yDomain1+' '+chart.yDomain2+' '+chart.yDomain);

        d3.select('#main svg')
            .datum(data)
            .transition().duration(100)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
});
