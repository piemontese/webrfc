/*
    Nomenclatura variabili
    <scope><type><name>
    
    <scope>
    g   globale
    
    <type>
    j   json
    x   xml
    s   string
    i   integer
    b   bool
*/

'use strict';

var gjAjaxData = [];
var gbAjaxSucces = false;

$(document).ready(function () {

    clearResults();
    
    $(document).ajaxComplete(function(event, xhr, settings) {
        ajaxShowResult(gjAjaxData, '#myModal');
    });
    $(document).ajaxError(function(e, jqxhr, settings, exception) {
        alert(exception);
    });
});


$(function(){
    $('#execButton').click(function(e){
        e.preventDefault();
        $(this).toggleClass('active');
        var data = { 
            _FUNCTION: 'Z_SAMPLERFC',
    //        _FUNCTION: $('#_FUNCTION').val(),
            name:      'Pietro',
            callback:  'jsonCallback',
    //        sqlTable:  'MARC',
            sqlTable:  $('#sqlTable').val(),
    //        sqlWhere:  'MATNR = \'ACF090-071026\' and werks = \'0100\'',
    //        sqlWhere:  'MATNR = \'ACF090-071026\'',
            sqlWhere:  $('#sqlWhere').val(),
    //        sqlFields: 'matnr werks ekgrp dispo sobsl dismm'
            sqlFields: $('#sqlFields').val(),
        };

        ajaxGetData(data);
    //    ajaxShowResult(gjAjaxData, '#myModal');

    });

    $('#deleteButton').click(function(e) {
        e.preventDefault();
        clearResults();
    });
});

function ajaxGetData(data) {
    gbAjaxSucces = false;
    $.ajax({
        url: 'http://mnibm09.novellini.it:8066/sap/bc/webrfc',
        data: data,
        async: false,
        type: 'POST',
        dataType: 'jsonp',
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentType: 'application/json',
        crossDomain: true,
        jsonpCallback: data.callback,
        success: function(data) {
//            gjAjaxData = data;
//            gbAjaxSucces = true;
            ajaxShowResult(data);
            $('#execButton').toggleClass('active');
        },
        error: function (data, textStatus, errorThrown) {
            /*
            alert(responseData + '\n' +
                  textStatus + '\n' +
                  errorThrown);
            */
            ajaxShowResult(data);
            $('#execButton').toggleClass('active');
        },
        fail: function(jqXHR, textStatus){
            if(textStatus === 'timeout')
            {     
                $('.results-container').html('<h1>Sistema SAP non disponibile<h1>');
                $('.results-container').show();
 //               alert('Failed from timeout'); 
                //do something. Try again perhaps?
            } else {
                $('.results-container').html('<h1>' + textStatus + '<h1>');
                $('.results-container').show();
            }
        },
        timeout: 10000 // sets timeout to 10 seconds
    });
}

function ajaxShowResult(data, modal) {
    if( data.results === undefined ) {   
        $('.results-container').html('<h1>Sistema SAP non disponibile<h1>');
        $('.results-container').show();
    } else if( !data.results.length ) {
        $('.results-container').html('<h2>Nessun risultato<h2>');
        $('.results-container').show();
    } else {
        showTableResults(data);
    }
}

function showTableResults(data) {
    var header = $('#sqlFields').val().split(" ");
    var str = '';
    /*
    str = "<ul>";
    for( var i=0; i<data.results.length; i++ ) {
        if( data.results[i].name == "MATNR" ) str += '</br>';
        str += "<li>" + data.results[i].name + ":\t" + data.results[i].value + "\n</li>";
    }
    */
    /*
    for( var i=0; i<data.results.item.length; i++ ) {
        str += "<li>" + data.results.item[i].name + ":\t" + data.results.item[i].value + "\n</li>";
    }
    */
    //str += "</ul>";
        
    str += '<div class=\"container table-results-header\">';
    str += '  <h2>Tabella ' + $('#sqlTable').val() + '</h2>';
    str += '  <p>Elenco valori</p>';
    str += '  <table class=\"table table-hover\">';
    str += '    <thead>';
    str += '      <tr>';
    /*
    for( var i=0; i<header.length; i++ ) {
        str += '<th>' + data.results[i].name + '</th>';
    }
    */
    for( var i=0; i<header.length; i++ ) {
        str += '<th>' + header[i] + '</th>';
    }
    str += '      </tr>';
    str += '    </thead>';
    str += '    <tbody class=\"table-results-body\">';
    if ( data.results !== undefined ) { 
        for( var j=0; j<data.results.length; j+=header.length ) {
            str += '      <tr>';
            for( var i=j; i<j+header.length; i++ ) {
                str += '<td>' + data.results[i].value + '</td>';
            }
            str += '      </tr>';
        }
    }
    str += '    </tbody>';
    str += '  </table>';        
    str += '</div>';
    
    //$(modal).modal().find('.modal-title').text('Risultati');
    //$(modal).modal().find('.modal-body').html(str);
    $('.results-container').html(str);
    $('.results-container').show();
}

function clearResults() {
    $('#_FUNCTION').val("");
    $('#sqlTable').val("");
    $('#sqlWhere').val("");
    $('#sqlFields').val("");
    
    $('.results-container').hide();
    
    gjAjaxData = [];
    gbAjaxSucces = false;    
}
                       
function jsonCallback(data) {
//    gbAjaxSucces = true;
}
