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
//            name:      'Pietro',
            callback:  'jsonCallback',
            sqlTable:  $('#sqlTable').val(),
            sqlWhere:  $('#sqlWhere').val(),
            sqlFields: $('#sqlFields').val(),
        };

        ajaxGetData(data);
        if( gbAjaxSucces == false )
            ajaxShowResult(gjAjaxData, '#myModal');

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
            gbAjaxSucces = true;
            ajaxShowResult(data);
//            $('#execButton').toggleClass('active');
        },
        error: function (data, textStatus, errorThrown) {
            /*
            alert(responseData + '\n' +
                  textStatus + '\n' +
                  errorThrown);
            */
            gbAjaxSucces = true;
            ajaxShowResult(data);
//            $('#execButton').toggleClass('active');
        },
        fail: function(jqXHR, textStatus){
            gbAjaxSucces = true;
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
        timeout: 120000 // sets timeout to 120 seconds
    });
    $('#execButton').toggleClass('active');
}

function ajaxShowResult(data, modal) {
    $('.results-container').hide();
    $('.error-container').hide();
    if( data.results === undefined ) {   
        $('.results-container').html('<h1>Sistema SAP non disponibile<h1>');
        $('.results-container').show();
    } else if( !data.results.length ) {
        if ( data.errors !== undefined ) { 
            for( var i=0; i<data.errors.length; i++ ) {
                $('.error-container').html('<h2>' + data.errors[i].msg + '<h2>');
                $('.error-container').show();
            }
        }
    } else {
        showTableResults(data);
    }
}

function showTableResults(data) {
    var str = '';
        
    str += '<div class=\"container table-results-header\">';
    str += '  <h2>Tabella ' + $('#sqlTable').val() + '</h2>';
    str += '  <p>Elenco valori</p>';
    str += '  <table class=\"table table-hover\">';
    str += '    <thead>';
    str += '      <tr>';
    
    for( var i=0; i<data.columns.length; i++ ) {
        str += '<th>' + data.columns[i].column + '</th>';
    }

    str += '      </tr>';
    str += '    </thead>';
    str += '    <tbody class=\"table-results-body\">';
    if ( data.results !== undefined ) { 
        for( var j=0; j<data.results.length; j+=data.columns.length ) {
            str += '      <tr>';
            for( var i=j; i<j+data.columns.length; i++ ) {
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
