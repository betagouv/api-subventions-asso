const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;

global.document = document;
global.window = window;

const jQuery = require('jquery');

window["$"] = jQuery;
window.jQuery = jQuery;
global["$"] = jQuery;
global.jQuery = jQuery;