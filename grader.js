#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio.  Teaches command line application development
and basic DOM parsing.

References:

+ cheerio
  - https://github.com/MattewMueller/cheerio
  - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
  - http://maxogden.com/scraping-with-node.html

+ commander.js
  - https://github.com/visionmedia/commander.js
  - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

+ JSON
  - http://en.wikipedia.org/wiki/JSON
  - https://developer.mozilla.org/en-US/docs/JSON
  - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var program = require('commander'),
    cheerio = require('cheerio'),
    fs      = require('fs');

// begin: added to handle FILE or URL.
var arg2,
    arg4,
    foru; // foru = file or url.
var rest = require('restler'),
    sys  = require('util');
var URLLINK_DEFAULT = "http://floating-citadel-8995.herokuapp.com/";
// end: added to handle FILE or URL.

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("\n\t\t< %s > does not exist.\n\t\t\tExiting.\n", instr);
	process.exit(1);  //  http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

// begin: added to handle URL.
var assertUrlExists = function(inurl) {
    if(rest.get(inurl).on('complete', function(result) {
	if(result instanceof Error) {
	    sys.puts('Error: ' + result.message);
	    process.exit(1);
	}
    }))
    return inurl;
};
// end: added to handle URL.

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

// begin: added to handle URL.
var checkUrlLink = function(inurl, checksfile) {
    rest.get(inurl).on("complete", function(result) {
	if(result instanceof Error) {
	    sys.puts('Error: ' + result.message);
	    this.retry(5000);
	    } else {
		$ = cheerioHtmlFile(result);
		var checks = loadChecks(checksfile).sort();
		var out = {};
		for(var ii in checks) {
		    var present = $(checks[ii]).length > 0;
		    out[checks[ii]] = present;
		}
		return out;
	    }
    });
};
// end: added to handle URL.

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    //  Workaround for commander.js issue.
    //  http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
// begin: added to handle FILE or URL.
    if(process.argv.length > 5) {// error proofing.
	process.argv.forEach(function(val, index, array) {
	    // capture argument OPTIONS for process flow determination.
	    if(index == 2) arg2 = val;
	    if(index == 4) arg4 = val;
	});
    } else {  // usage error: fewer arguments than required.
	console.log("USAGE: need 4 arguments:");
	console.log("\t\t-c or --checks and <check_file>\n\tAND");
	console.log("\t\t-f or --file and <html_file>\n\tOR");
	console.log("\t\t-u or --url and <url_link>");
	console.log("Exiting now.");
	process.exit(1);
    }
    // determine if input supplied is file or url.
    if(arg2 == "-f" || arg2 == "--file") foru = "file";
    if(arg2 == "-u" || arg2 == "--url") foru = "url";
    if(arg4 == "-f" || arg4 == "--file") foru = "file";
    if(arg4 == "-u" || arg4 == "--url") foru = "url";
    if(foru == "file") {// file process flow.
// end: added to handle FILE or URL.
	program
	    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	    .parse(process.argv);
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    } else {
	exports.checkHtmlFile = checkHtmlFile;
    }
// begin: copied, modified, or added to handle FILE or URL.
    if(foru == "url") {// url process flow.
	program
	    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	    .option('-u, --url <url_link>', 'URL link', clone(assertUrlExists), URLLINK_DEFAULT)
	    .parse(process.argv);
	var checkJson = checkUrlLink(program.url, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    } else {
	exports.checkUrlLink = checkUrlLink;
    }
// end: copied, modified, or added to handle FILE or URL.
}
