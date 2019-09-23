var validator = require('xsd-schema-validator');

validator.validateXML(
    { file: 'csulb.kml' }, 
    'schemas/ogckml22.xsd', function(err, result) 
        {
           //if (err)  throw err;
           console.table([result.valid, result.result])

           for (i=0; i< result.messages.length; i++)
            console.log('ERROR[',i,']: ', result.messages[i]);
    }
);
//! ***********************************************************************

/*
const fs = require('fs');
const xmllint = require('node-xmllint');

var xml_doc = fs.readFileSync("examples.kml","utf8");

var xsd_doc = fs.readFileSync("ogckml22.xsd","utf8");

//console.log(xml_doc, " \n\n\n\n\n", xsd_doc)

console.log(xmllint.validateXML({
    xml: xml_doc,
    schema: xsd_doc,
    arguments: ["--version"]
}))
*/

