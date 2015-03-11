/**
 * Created by Lukasz on 21/02/2015.
 */

var isQuiz = false;
var correctAnswers = [0, 0, 0, 1, 1, 0, 1, 0, 1, 0];
window.onload = function (e) {
    console.log('asdasdas');

};
function hide(id) {
    d3.select('#' + id).transition().delay(100).duration(1000).style({"opacity": 0, height: '0px'}).remove();
}

function quiz() {
    //document.getElementsByName('q1').addEventListener("click", validate);
    // document.getElementById("qqq1").addEventListener("click", validate);
    d3.selectAll('.radio-inline').on('click', function (d) {
        validate(this);
    });
    //document.getElementById("qqq1")
    var id = '#quiz';
    var opacity = 1, width = window.innerWidth * 0.25 + 'px';
    if (isQuiz) {
        opacity = 0;
        width = '0px';
    }
    else {
        d3.select(id).style({"display": 'block'});
    }
    // d3.select(id).append(!isQuiz+'  '+width);
    d3.select(id).transition().duration(1500).style({opacity: opacity, width: width});//.transition().delay(100).duration(1200).style("right",50);
    if (isQuiz)d3.select(id).transition().delay(1400).style({"display": 'none'});
    isQuiz = !isQuiz;
}

function hint(series, normalise) {
    if (!(series instanceof Array)) {
        var button = document.getElementById(series);
        button.click();
    }
    else
        setSeries(series);
    if (normalise != undefined) {
        if (normalise === true && isMainNormalised === false)NormaliseMode(true);
        if (normalise === false && isMainNormalised === true)NormaliseMode(true);
    }
    quiz();
}

function validate(id) {
    var parent = id.parentNode.id;
    var radios = -1;
    if (document.getElementsByName(parent)[0].checked) radios = 0;
    else if (document.getElementsByName(parent)[1].checked) radios = 1;
    else return;
    //console.log(radios);
    var text = "not set";
    console.log(correctAnswers[country][parseInt(parent.slice(1)) - 1]+' '+country);
    var isCorrect = radios == correctAnswers[country][parseInt(parent.slice(1)) - 1];
    //console.log(isCorrect + '  ' + parseInt(parent.slice(-1)) + ' ' + correctAnswers[parseInt(parent.slice(-1)) - 1]);
    var correct = '✓ Correct';
    var wrong = '✘ Wrong';
    //var status = correct;
    if (isCorrect) {
        text = correct;
    }
    else text = wrong;
    var statusdiv = d3.select('#' + parent + 'status');
    if (statusdiv[0][0] != null && statusdiv[0][0] != undefined) {
        d3.select('#' + parent + 'status').classed({'wrong': !isCorrect, 'correct': isCorrect}).html(text);
    }
    else {
        d3.select('#' + parent).append('div').attr('id', parent + 'status')
            .classed({'wrong': !isCorrect, 'correct': isCorrect}).html(text);
    }
}