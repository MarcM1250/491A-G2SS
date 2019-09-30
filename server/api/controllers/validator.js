var fs = require('fs');
var os = require('os');
var path = require('path');
var spawn = require('child_process').spawn;

var CLASSPATH_SEPARATOR = os.platform() === 'win32' ? ';' : ':';
var JAVA_HOME = process.env.JAVA_HOME;

var BASE_DIR = path.resolve(__dirname + '/');
var VALIDATOR = path.resolve( BASE_DIR + '/xmlvalidator.jar');

var JAVA = JAVA_HOME ? JAVA_HOME + '/bin/java' : 'java';

function withValidator(callback) {

  console.log(VALIDATOR);

  if (fs.existsSync(VALIDATOR ))
    callback();
  else
    console.log("Need the xmlvalidator.jar file")
}

function stripLineEnding(str) {
  return str.replace(/[\r\n]+/g, '');
}

function Validator(options) {
  options = options || {};

  this.cwd = options.cwd || process.cwd();
  this.debug = true;
}

/**
 * Validate a xml file against the given schema
 *
 * @param {String|Buffer|ReadableStream|Object} xml
 * @param {String} schema path to schema
 * @param {Function} callback to be invoked with (err, result)
 */
Validator.prototype.validateXML = function(xmlString, schema, callback) {

  var cwd = this.cwd,
      debug = this.debug;

  // validate input and set validator mode
  var xmlString = xmlString;

  if (!xmlString) {
    return callback(
      new Error(
        '<xml> parameter is missing ' +
        'expected String|Buffer|Object={ file: path }'
      )
    );
  }

  withValidator(function(err) {

    if (err) {
      return callback(err);
    }

    var validatorChildProcess = spawn(JAVA, [
      '-jar',
      VALIDATOR,
      '-Dfile.encoding=UTF-8',
      '-classpath',
      [ BASE_DIR, cwd ].join(CLASSPATH_SEPARATOR),
      'support.XMLValidator',
      '-stdin',
      '-schema=' + schema
    ], { cwd: cwd });

    var result, code, messages = [];

    function finish(result, code) {
      var success = !code,
          err = success ? null : buildError(result);

      callback(err, {
        valid: success,
        result: result,
        messages: messages
      });
    }

    function handleText(data) {
      var msg = data.toString('utf-8');

      if (msg.indexOf('[') === 0) {
        messages.push(stripLineEnding(msg));
      } else
      if (msg.indexOf('result=') === 0) {
        result = stripLineEnding(msg.slice('result='.length));

        if (code !== undefined) {
          finish(result, code);
        }
      } else {
        if (debug) {
          console.log(msg);
        }
      }
    }

    function buildError(result) {
      var msg = 'invalid xml (status=' + result + ')';
      messages.forEach(function(m) {
        msg += '\n\t' + m;
      });

      return new Error(msg);
    }

    validatorChildProcess.on('exit', function(exitCode) {
      code = exitCode;

      finish(result ? result : code ? 'WITH_ERRORS' : 'OK', code);
    });

    validatorChildProcess.stderr.on('data', handleText);
    validatorChildProcess.stdout.on('data', handleText);

    var stdin = validatorChildProcess.stdin;

    if (xmlString) {
      stdin.write(xmlString);
    }
    // end input
    stdin.end();
  });

};

module.exports = Validator;

/**
 * Validate xml based on the given schema.
 *
 * @param {String|ReadableStream} xml
 * @param {String} schema
 * @param {Function} callback
 */
module.exports.validateXML = function(xml, schema, callback) {
  return new Validator().validateXML(xml, schema, callback);
};