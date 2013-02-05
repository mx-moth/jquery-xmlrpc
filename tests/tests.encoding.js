/*jshint browser:true jquery:true */
/*globals deepEqual equal ok assert test module */
(function() {
	"use strict";
	module("Encoding");

	/**
	* Serialize an Element to a string easily
	*/
	var s = (function() {
		var serializer = new XMLSerializer();
		return function($node) {
			return serializer.serializeToString($node[0]);
		};
	})();

	/**
	* A wrapper around test functions that makes an $xml function for testing
	* with. Kinda like a Python decorator
	*/
	var need$xml = function(fn) {
		return function() {
			var doc = document.implementation.createDocument(null, null, null);
			var $xml = function(name) {
				return $(doc.createElement(name));
			};

			var args = [].slice.call(arguments);
			args.unshift($xml);

			return fn.apply(this, args);
		};
	};

	test("JavaScript primitive value encoding", need$xml(function($xml) {
		var types = $.xmlrpc.types;

		deepEqual(types.boolean.encode(true, $xml), $xml('boolean').text('1'),
			"Boolean true encodes to <boolean>1</boolean>");

		deepEqual(types.boolean.encode(false, $xml), $xml('boolean').text('0'),
			"Boolean true encodes to <boolean>0</boolean>");


		deepEqual(types.int.encode(3, $xml), $xml('int').text('3'),
			"Integer 3 encodes to <int>3</int>");
		deepEqual(types.i8.encode(4, $xml), $xml('i8').text('4'),
			"Integer 3 encodes to <i8>4</i8>");
		deepEqual(types.double.encode(5.5, $xml), $xml('double').text('5.5'),
			"Double 5.5 encodes to <double>5.5</double>");

		deepEqual(types.nil.encode(null, $xml), $xml('nil'),
			"Null encodes to <nil>");
		deepEqual(types.nil.encode("hello", $xml), $xml('nil'),
			"Null encodes to <nil> when supplied a non-null value");

		deepEqual(types.string.encode("Hello, World!", $xml), $xml('string').text("Hello, World!"),
			"String encodes to <string>...</string>");
		deepEqual(types.string.encode("", $xml), $xml('string').text(""),
			"Empty String encodes to <string></string>");

		var timestamp = 1350943077107;
		var datestring = "2012-10-22T21:57:57Z";
		var date = new Date();
		date.setTime(timestamp);
		deepEqual(types['datetime.iso8601'].encode(date, $xml), $xml('dateTime.iso8601').text(datestring),
			"Date encodes to <dateTime.iso8601>...</dateTime.iso8601>");

	}));

	test("Array encoding", need$xml(function($xml) {
		var types = $.xmlrpc.types;

		equal(s(types.array.encode([4, "Hello"], $xml)),
			'<array><data><value><int>4</int></value><value><string>Hello</string></value></data></array>',
			"Simple array encodes");

		// If not all browsers encode this to <data/>, this will fail.
		equal(s(types.array.encode([], $xml)),
			'<array><data/></array>',
			"Empty array encodes");

		equal(s(types.array.encode([1, [2]], $xml)),
			'<array><data>' +
				'<value><int>1</int></value>' +
				'<value><array><data>' +
					'<value><int>2</int></value>' +
				'</data></array></value>' +
			'</data></array>',
			"Array containing array encodes");
	}));

	test("Guessing types", need$xml(function($xml) {
		ok($.xmlrpc.toXmlRpc(4, $xml).is('int'),
			"Number 4 guessed to be <int>");

		ok($.xmlrpc.toXmlRpc(4.5, $xml).is('double'),
			"Number 4.5 guessed to be <double>");

		ok($.xmlrpc.toXmlRpc(true, $xml).is('boolean'),
			"Boolean guessed to be <boolean>");

		ok($.xmlrpc.toXmlRpc(null, $xml).is('nil'),
			"null guessed to be <nil>");

		ok($.xmlrpc.toXmlRpc(undefined, $xml).is('nil'),
			"undefined guessed to be <nil>");

		ok($.xmlrpc.toXmlRpc("Hello", $xml).is('string'),
			"String guessed to be <string>");

		ok($.xmlrpc.toXmlRpc(new Date(), $xml).is('dateTime\\.iso8601'),
			"Date guessed to be <dateTime.iso8601>");

		ok($.xmlrpc.toXmlRpc({foo: 'bar'}, $xml).is('struct'),
			"Object guessed to be <struct>");

		ok($.xmlrpc.toXmlRpc([], $xml).is('array'),
			"Array guessed to be <array>");

		ok($.xmlrpc.toXmlRpc(new ArrayBuffer(), $xml).is('base64'),
			"ArrayBuffer guessed to be <base64>");
	}));

})();
