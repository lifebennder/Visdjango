/**
 * Created by Lukasz on 21/02/2015.
 */

var isQuiz = false;
window.onload = function (e) {

    //if(isQuiz) isQuiz=true;
}


function quiz() {
    var id = '#quiz';
    var opacity = 1, width = window.innerWidth*0.3+'px';
    if (isQuiz) {
        opacity = 0;
        width = '0px';
    }
    else {d3.select(id).style({"display":'initial'});}
   // d3.select(id).append(!isQuiz+'  '+width);
    d3.select(id).transition().duration(1500).style({opacity: opacity, width:width});//.transition().delay(100).duration(1200).style("right",50);
    if(isQuiz)d3.select(id).transition().delay(1400).style({"display": 'none'});
    isQuiz = !isQuiz;
}