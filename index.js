var through = require('through2')
	, Freemarker = require('freemarker.js')
	, PluginError = require('gulp-util').PluginError

module.exports = function(options) {

	if (!arguments.length)
		throw new PluginError('gulp-freemarker', 'invoked with no arguments!')

	if (!options.viewRoot)
		throw new PluginError('gulp-freemarker', 'viewRoot option is mandatory!')

	var engine = new Freemarker(options)

	return through.obj(function(file, encoding, callback) {
		if (file.isNull()){
			this.push(file)
			return callback()
		}
		if (file.isBuffer()) {
			try{
				var config = JSON.parse(file.contents)
			}catch(err){
				callback(err)
			}
			engine.render(config.file || config.tpl, config.data, function(err, html, output) {
				if (err) return callback(err)
				file.contents = new Buffer(html || output)
				file.path = file.path.replace('.json', '.html') // fixme: feels a bit hacky
				this.push(file)
				return callback(null)
			}.bind(this))
		}
		if (file.isStream()){
			var data = []
			file.contents.on('data', function(chunk) {
				data.push(chunk)
			})
			file.contents.on('end', function() {
				try{
					var config = JSON.parse(data.join(String()))
				}catch(err){
					callback(err)
				}
				engine.render(config.file || config.tpl, config.data, function(err, html, output) {
					if (err) return callback(err)
					var stream = through()
					stream.on('error', this.emit.bind(this, 'error'))
					stream.write(html || output)
					file.contents = stream
					stream.end()
					this.push(file)
					return callback(null)
				}.bind(this))
			}.bind(this))
			file.contents.on('error', function(err) {
				this.emit('error', new PluginError('gulp-freemarker', 'Read stream error!'))
			}.bind(this))
		}
	})
}
