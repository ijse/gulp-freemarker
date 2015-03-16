var through = require("through2"),
	Freemarker = require('freemarker.js'),
	gutil = require("gulp-util");

module.exports = function (param) {
	"use strict";
	var Fm = null;

	// check for required params
	if (!param) {
		throw new gutil.PluginError("gulp-freemarker", "No param supplied");
	}
	if (!param.viewRoot) {
		throw new gutil.PluginError("gulp-freemarker", "viewRoot param is necessary!");
	}

	Fm = new Freemarker(param);

	function freemarker(file, enc, callback) {
		/*jshint validthis:true*/

		// Do nothing if no contents
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {

			// accepting streams is optional
			this.emit("error",
				new gutil.PluginError("gulp-freemarker", "Stream content is not supported"));
			return callback();
		}

		// check if file.contents is a `Buffer`
		if (file.isBuffer()) {

			// Get mock data
			var mockData = JSON.parse(file.contents);

			// process template with mock data
			var _this = this;
			Fm.render(mockData.tpl, mockData.data, function(err, out, msg) {

				// return result or error msg from freemarker engine
				file.contents = new Buffer(out || msg);
				_this.push(file);
				callback()
			});

		}
		return ;
	}

	return through.obj(freemarker);
};
