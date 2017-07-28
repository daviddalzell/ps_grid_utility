/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/


(function () {
    'use strict';
    
    var csInterface = new CSInterface();
    var gExtensionId =  csInterface.getExtensionID();
    console.log(gExtensionId);
    var quickExportItems = [];
    var gSnapPow = true;
    var gLastGridSize;
    var gLastGridPercent;
    
    var color = {};
    
    function Persistent() {
        var event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
        event.extensionId = gExtensionId;
        csInterface.dispatchEvent(event);
    }
    
    function clampRange( value, min, max ) {
        return Math.max(Math.min(value, max), min); 
    }
    
    function nearestPow2( value ) {
      return Math.pow( 2, Math.round( Math.log( value ) / Math.log( 2 ) ) ); 
    }   
    
    function setGridPixels( val ) {
        //console.log( "setGridPixels ", val)
        csInterface.evalScript( 'SetGridPixels('+JSON.stringify( val)+')' );
    }
    
    function setGridPercent( val ) {
        //console.log( 'setGridPercent', val )
        csInterface.evalScript( 'SetGridPercent('+JSON.stringify( val )+')' );
    }
    
    function setSubDivisions( val ) {
        //console.log( "setSubDivisions", val );
        csInterface.evalScript( 'setSubDivisions('+JSON.stringify( val )+')' );
    }
    
    
    
    function init() {
        
        Persistent();
        
        themeManager.init(); 
        
        $("#grid-pixels").prop("checked", true) 
        $("#grid-size-input").val( 256 )
        gLastGridSize = $("#grid-size-input").val()
        $("#grid-subd-input").val( 2 )
        $("#grid-size-range").val( $("#grid-size-input").val())
        $("#grid-subd-range").val( $("#grid-subd-input").val())
        $("#grid-size-range").prop( "max", "1024")
        $("#grid-size-range").prop( "min", "1")
        $("#pow").prop("checked", true )
                
        
        $("#grid-size-input").on( 'input', function() {
            var val = $("#grid-size-input").val()
            if ( $("#grid-pixels").is(":checked") ) {
                val = clampRange( val, 1, 8192 )
                setGridPixels( val );
            }
            else {
                val = clampRange( val, 1.0, 100.0 )
                setGridPercent( val );
            }
            $("#grid-size-input").val( val )
            $("#grid-size-range").val( val )
            
        })
        
        $("#grid-size-range").on( 'input', function() {
            var value = $("#grid-size-range").val()
            if ( $("#grid-pixels").is(":checked") ) {
                console.log( gSnapPow)
                if ( gSnapPow ){   
                    value = nearestPow2( value );
                }
                setGridPixels( value );
            }
            else {
                setGridPercent( value );
            }   
            $("#grid-size-input").val( value );
        })

                                 
        $("#grid-subd-input").on( 'input', function() {
            var subd = $("#grid-subd-input").val()
            setSubDivisions( subd );
        })
        
        $("#grid-subd-range").on( 'input', function() {
            var subd = $("#grid-subd-range").val();
            $("#grid-subd-input").val( subd );
            setSubDivisions( subd );
        })
        
        $(".topcoat-radio-button").click( function(){
            if ( $("#grid-pixels").is(":checked") ) {
                gSnapPow = true;
                $("#grid-size-range").prop( "max", "1024")
                $("#grid-size-input").val( gLastGridSize )
                $("#grid-size-range").val( $("#grid-size-input").val() )
                setGridPixels( $("#grid-size-input").val() );
            }
            else{
                gLastGridSize = $("#grid-size-input").val()
                gSnapPow = false;
                $("#grid-size-range").prop( "max", "100")
                csInterface.evalScript( 'getDocMaxSize()', function( maxPix ) {
                    console.log( maxPix )
                    if ( maxPix > 0) {
                        maxPix = parseInt( maxPix );
                        var percent = ( gLastGridSize/maxPix )*100;
                        percent = Math.max( Math.min( percent, 100 ), 1 );
                        $("#grid-size-input").val( percent );
                        
                    }
                    else{
                        $("#grid-size-input").val( 50 ) 
                        console.log( "No documents open" )
                    }
                    setGridPercent( $("#grid-size-input").val() )
                    $("#grid-size-range").val( $("#grid-size-input").val() )
                } );
            }
        })
        
        $("#show_grid").click( function() {
            csInterface.evalScript( "toggleGrid()" );
        })
        
        $(":checkbox").click( function() {
            gSnapPow = $("#pow").is(":checked")
            console.log( gSnapPow );
        });
        
        $(".topcoat-button-bar__button").click( function() { 
            var button = this.id;
            console.log( button )
            csInterface.evalScript( 'setGridStyle('+JSON.stringify( button )+')' )
            
        })
        
        $(".topcoat-icon-button--quiet").click( function( event ) {
            
            if (event.currentTarget.id == "custom_color") {
                csInterface.evalScript( 'pickColor()', function (result ) {
                    if (result) {
                        var colorArray = result.split(',');
                        csInterface.evalScript( 'setGridColor('+JSON.stringify( colorArray )+')' );
                        $("#custom_color_icon").css( "background-color", colorArray[3]);
                    }
                    else {
                        console.log( 'user cancelled' );
                    }

                } );
            }
            else {
                var colorString = event.currentTarget.children[0].style.backgroundColor;
                colorString= colorString.slice(4, -1);
                var colorArray = colorString.split(',');
                console.log( colorArray );
                csInterface.evalScript( 'setGridColor('+JSON.stringify( colorArray )+')' );
            }

            
            
        });
    }
    
    init();
    
    

}());