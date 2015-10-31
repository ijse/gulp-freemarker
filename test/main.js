'use strict';

var fs = require('fs')
	, es = require('event-stream')
	, expect = require('expect.js')
	, path = require('path')

require('mocha')

delete require.cache[require.resolve('../')]

var File = require('gulp-util').File
	, freemarker = require('../index')

describe('gulp-freemarker', function () {

	var expectedFile, sourceStream, sourceBuffer, defaultOptions

	beforeEach(function() {
		expectedFile = new File({
			path: path.join(__dirname, 'expected', 'hello.txt'),
			cwd: __dirname,
			base: path.join(__dirname, 'expected'),
			contents: fs.readFileSync(path.join(__dirname, 'expected', 'hello.txt'))
		})
		sourceStream = new File({
			path: path.join(__dirname, 'fixtures', 'hello.json'),
			cwd: __dirname,
			base: path.join(__dirname, 'fixtures'),
			contents: fs.createReadStream(path.join(__dirname, 'fixtures', 'hello.json'))
		})
		sourceBuffer = new File({
			path: path.join(__dirname, 'fixtures', 'hello.json'),
			cwd: __dirname,
			base: path.join(__dirname, 'fixtures'),
			contents: fs.readFileSync(path.join(__dirname, 'fixtures', 'hello.json'))
		})
		defaultOptions = {viewRoot: path.join(__dirname, 'fixtures'), options: {}}
	})

	it('exports a function', function(){
		expect(freemarker).to.be.a('function')
	})

	it('throws an error if invoked without arguments', function(){
		expect(freemarker).throwException(/^invoked with no arguments!$/)
	})

	it('throws an error if no viewRoot is defined', function(){
		expect(function(){
			freemarker({viewRoot: undefined})
		}).to.throwException(/^viewRoot option is mandatory!$/)
	})

	it('skips null files', function(done) {
		var nullFile = new File()
			, stream = freemarker(defaultOptions)
		stream.on('data', function(file){
			expect(file).to.equal(nullFile)
			done()
		})
		stream.write(nullFile)
		stream.end()
	})

	it('produces file on stream', function (done) {
		var stream = freemarker(defaultOptions)
		stream.on('data', function (file) {
			expect(file).to.be.ok()
			expect(file.contents).to.be.ok()
			file.contents.pipe(es.wait(function(err, data) {
				expect(err).to.be(null)
				expect(String(data)).to.be(String(expectedFile.contents))
				done()
			}))
		})
		stream.write(sourceStream)
		stream.end()
	})

	it('produces file on buffer', function (done) {
		var stream = freemarker(defaultOptions);
		stream.on('data', function (file) {
			expect(file).to.be.ok()
			expect(file.contents).to.be.ok()
			expect(String(file.contents)).to.be(String(expectedFile.contents))
			done()
		})
		stream.write(sourceBuffer)
		stream.end()
	})
})
