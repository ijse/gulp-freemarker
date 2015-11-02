
# gulp-freemarker
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> freemarker plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-freemarker` as a development dependency:

```shell
npm install --save-dev gulp-freemarker
```

Then, add it to your `gulpfile.js`:

```javascript
var freemarker = require("gulp-freemarker");

gulp.src("./mock/*.json")
	.pipe(freemarker({
		viewRoot: "WEB-INF/views/",
		options: {}
	}))
	.pipe(gulp.dest("./www"));
```

You should provide mock files, which type is json:

```json
{
	"file": "hello.ftl",
	"data": {
		"name": "World"
	}
}
```


* `file` is relative to `viewRoot`, gulp-freemarker will read and process `${viewRoot}/${file}` file.

* `data` is the data model the template required.


## API

### freemarker(options)

#### options.viewRoot
Type: `String`
Required: true

The directory where all templates files in.

#### options.options
Type: `Object`
Default: {}

Options for [Freemarker.js](http://github.com/ijse/freemarker.js). see also [https://github.com/ijse/freemarker.js#configurations](https://github.com/ijse/freemarker.js#configurations).


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-freemarker
[npm-image]: https://badge.fury.io/js/gulp-freemarker.png

[travis-url]: http://travis-ci.org/ijse/gulp-freemarker
[travis-image]: https://secure.travis-ci.org/ijse/gulp-freemarker.png?branch=master

[coveralls-url]: https://coveralls.io/r/ijse/gulp-freemarker
[coveralls-image]: https://coveralls.io/repos/ijse/gulp-freemarker/badge.png

[depstat-url]: https://david-dm.org/ijse/gulp-freemarker
[depstat-image]: https://david-dm.org/ijse/gulp-freemarker.png
