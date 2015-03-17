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

		var _this = this;

		if (file.isStream()) {

			var mockDataTxt = '';

			file.contents.on('data', function(chunk) {
				mockDataTxt += chunk;
			});

			file.contents.on('end', function() {
				var mockData = JSON.parse(mockDataTxt);
				Fm.render(mockData.tpl, mockData.data, function(err, out, msg) {
					var stream = through();

					stream.write(out || msg);

					// Emit error to file
					stream.on('error', _this.emit.bind(_this, 'error'));
					file.contents = stream;
					stream.end();

					_this.push(file);
					return callback();
				});
			});

			file.contents.on('error', function(err) {
				_this.emit('error',
					new gutil.PluginError('gulp-freemarker', 'Read stream error!'));
			});

		}

		// check if file.contents is a `Buffer`
		if (file.isBuffer()) {

			// Get mock data
			var mockData = JSON.parse(file.contents);

			// process template with mock data
			Fm.render(mockData.tpl, mockData.data, function(err, out, msg) {

				// return result or error msg from freemarker engine
				file.contents = new Buffer(out || msg);
				_this.push(file);
				return callback();
			});

		}
		return ;
	}

	return through.obj(freemarker);
};
