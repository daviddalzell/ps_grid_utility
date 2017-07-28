

cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };


// Set Grid Size in Pixels==============
function SetGridPixels( pixels ) {
    
    var subd = app.preferences.gridSubDivisions

    var dialogMode = DialogModes.NO;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('GdPr'));
    ref1.putEnumerated(cTID('capp'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putDouble(cTID('GrdM'), pixels );
    desc2.putEnumerated(cTID('Grdt'), cTID('RlrU'), cTID('RrPx'));
    desc2.putInteger(cTID('Grdn'), subd );
    desc1.putObject(cTID('T   '), cTID('GdPr'), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
}


//Set Grid Percent 
function SetGridPercent( percent ) {
    var dialogMode = DialogModes.NO;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    
    ref1.putProperty(cTID('Prpr'), cTID('GdPr'));
    ref1.putEnumerated(cTID('capp'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putDouble(cTID('GrdM'), percent );
    desc2.putEnumerated(cTID('Grdt'), cTID('RlrU'), cTID('RrPr'));
    desc1.putObject(cTID('T   '), cTID('GdPr'), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);

}

//Set grid color using Color as an object
function setGridColor( color_rgb ) { 

    var color = colorArray2colorObj( color_rgb )
    
    var dialogMode = DialogModes.NO;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    
    ref1.putProperty(cTID('Prpr'), cTID('GdPr'));
    ref1.putEnumerated(cTID('capp'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(cTID('GrdC'), cTID('GdGr'), cTID('Cst '));
    var desc3 = new ActionDescriptor();
    desc3.putDouble(cTID('Rd  '), color.r );
    desc3.putDouble(cTID('Grn '), color.g );
    desc3.putDouble(cTID('Bl  '), color.b );
    desc2.putObject(cTID('Grds'), sTID("RGBColor"), desc3);
    desc1.putObject(cTID('T   '), cTID('GdPr'), desc2);
    executeAction(cTID('setd'), desc1, dialogMode);
}

function setSubDivisions( subd ) {
    app.preferences.gridSubDivisions = subd;
}

function setGridStyle( style ) {
    var lineStyle
    switch(style){    
        case 'SOLID':
            lineStyle = GridLineStyle.SOLID
            break;
        case 'DASHED':
            lineStyle = GridLineStyle.DASHED
            break;
        case 'DOTTED':
            lineStyle = GridLineStyle.DOTTED
            break;      
    }
    app.prefernces.gridStyle = lineStyle;
}

function pickColor() {
    
    var hexToRGB = function(hex) {
      var r = hex >> 16;
      var g = hex >> 8 & 0xFF;
      var b = hex & 0xFF;
      return [r, g, b];
    };
    
    var color_decimal =  $.colorPicker();
    if (color_decimal == -1) {
        return ""
    }
    
    var color_hexadecimal = color_decimal.toString(16);
    var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
    //return [ RGB color, padded hex string ]
    return [ color_rgb, "#"+("00000" + color_hexadecimal.toString(16)).substr(-6) ]
}

function colorArray2colorObj( color_rgb ) {
    color = new Object;
    color.r = color_rgb[0]
    color.g = color_rgb[1]
    color.b = color_rgb[2]
    return color
}

function toggleGrid() {
    // replacing 'TgGr' with a var thats passed in  makes this a generic toggle
    try {
        var idslct = charIDToTypeID( 'slct' );     
        var desc734 = new ActionDescriptor();     
        var idnull = charIDToTypeID( 'null' );        
        var ref595 = new ActionReference();         
        var idMn = charIDToTypeID( 'Mn  ' );         
        var idMnIt = charIDToTypeID( 'MnIt' );         
        var idTgGr = charIDToTypeID( 'TgGr' );         
        ref595.putEnumerated( idMn, idMnIt, idTgGr );    
        desc734.putReference( idnull, ref595 ); 
        executeAction( idslct, desc734, DialogModes.NO ); 
        } 
    catch(e){
        //alert(e)
        } 
}

function setGridStyle( style )
{
    app.preferences.gridStyle = GridLineStyle[ style];
}


function CycleGridStyles()
{
    if (app.preferences.gridStyle =="GridLineStyle.SOLID")
        {app.preferences.gridStyle = GridLineStyle.SOLID
          return app.preferences.gridStyle}
        
    if (app.preferences.gridStyle == "GridLineStyle.DASHED")
        {app.preferencethise = GridLineStyle.DASHED
            return app.preferences.gridStyle}
        
    if (app.preferences.gridStyle == "GridLineStyle.DOTTED")
        {ap.topcoat-icon-buttonyle = GridLineStyle.DOTTED
            return app.preferences.gridStyle}      
}

function getDocMaxSize() {
    if (app.documents.length > 0 ){
        var width = app.activeDocument.width
        var height = app.activeDocument.height
        return Math.max( width, height )
    }
    else {
        return 0
    }

}