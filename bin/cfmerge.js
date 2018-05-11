#!/usr/bin/env node
//
// File:	cfmerge.js
// Date:	05/10/2018
// Author:	Ivan Kluzak
// Notes:	Load multiple CloudFormation YAML files and merge them into a single stack if possible
//
// 
var	fs	= require('fs');
var	path	= require('path');
var	YAML 	= require('yamljs');
const 	VERSION = "0.1";
const	DEBUG	= false;

function debug(msg) {
	if (DEBUG === true) {
		console.log(msg);
	}
}

if (typeof process.env.CFMERGE_PREFIX_DIR === 'undefined') {
	process.env.CFMERGE_PREFIX_DIR = './';
}

var t = {};

var f = YAML.load(path.join(process.env.CFMERGE_PREFIX_DIR, 'cfmerge.yml'));
if (f.version != VERSION) {
	console.error(`invalid version: '${f.version}' expected '${VERSION}'`);
	process.exit();
}

// debug
debug(JSON.stringify(f, null, 2));

//
// Let's start building our CloudFormation template
//t.version = "0.2";
t.AWSTemplateFormatVersion = "2010-09-09";
t.Resources = {};

if (typeof f.lambda !== 'undefined') {
	debug("We have a Lambda block defined...");
	if (f.lambda.exclude === true) {
		debug("\tskipping...");
	} else {

		for (var i=0; i < f.lambda.files.length; i++) {

			debug(`\t${f.lambda.files[i]}`);

//			var lin = fs.readFileSync(f.lambda.files[i]);
			var lin = YAML.load(path.join(process.env.CFMERGE_PREFIX_DIR,f.lambda.files[i])); // f.lambda.files[i]);
//			debug(JSON.stringify(lin, null, 2));
			//t.Resources = lin.Resources;

			for(var key in lin.Resources){ 
				t.Resources[key] = lin.Resources[key];
			}

			//var ys = YAML.stringify(lin.Resources, 4);
			//debug(ys);
		}
	}
}

if (typeof f.apigw !== 'undefined') {
	debug("We have an API gateway block defined...");
	if (f.apigw.exclude === true) {
		debug("\tskipping...");
	} else {
//		var apigw = fs.readFileSync(path.join(process.env.CFMERGE_PREFIX_DIR,f.apigw.file));
//		t.Resources[f.apigw.name] = f.apigw.header;
//		t.Resources.

                for (var i=0; i < f.apigw.files.length; i++) {

                        debug(`\t${f.apigw.files[i]}`);
                        var lin = YAML.load(path.join(process.env.CFMERGE_PREFIX_DIR,f.apigw.files[i]));

                        for(var key in lin.Resources){
                                t.Resources[key] = lin.Resources[key];
                        }
                }

	}
}

// Apply the serverless Transform
t.Transform = 'AWS::Serverless-2016-10-31';

debug("\n\n");
console.log(YAML.stringify(t, 16));

