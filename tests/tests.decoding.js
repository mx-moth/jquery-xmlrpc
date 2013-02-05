/*jshint browser:true jquery:true */
/*globals deepEqual equal ok assert test module */
(function() {
	"use strict";
	module("Decoding");

	/**
	* Generate an element from a string, and return just that element
	*/
	function el(xml) {
		return $(xml)[0];
	}

	test("JavaScript primitive value decoding", function($xml) {

		equal($.xmlrpc.parseNode(el('<boolean>1</boolean>')), true,
			'<boolean> true node decodes');

		equal($.xmlrpc.parseNode(el('<boolean>0</boolean>')), false,
			'<boolean> false node decodes');


		equal($.xmlrpc.parseNode(el('<int>4</int>')), 4,
			'<int> node decodes');
		equal($.xmlrpc.parseNode(el('<i4>5</i4>')), 5,
			'<i4> node decodes');
		equal($.xmlrpc.parseNode(el('<i8>6</i8>')), 6,
			'<i8> node decodes');
		equal($.xmlrpc.parseNode(el('<i16>7</i16>')), 7,
			'<i16> node decodes');
		equal($.xmlrpc.parseNode(el('<double>8.9</double>')), 8.9,
			'<double> node decodes');

		equal($.xmlrpc.parseNode(el('<nil/>')), null,
			'<nil> node decodes');
		equal($.xmlrpc.parseNode(el('<nil>Hello</nil>')), null,
			'<nil> node decodes, even when not empty');

		equal($.xmlrpc.parseNode(el('<string>Hello</string>')), "Hello",
			'<string> node decodes');

		equal($.xmlrpc.parseNode(el('<string></string>')), "",
			'Empty <string> node decodes');

		var timestamp = 1350943077000;
		var datestring = "2012-10-22T21:57:57Z";
		var dateNode = el('<dateTime.iso8601>' + datestring + '</dateTime.iso8601>');
		equal($.xmlrpc.parseNode(dateNode).getTime(), timestamp,
			"<dateTime.iso8601> node decodes");
	});

	test("Array decoding", function($xml) {
		deepEqual($.xmlrpc.parseNode(el('<array><data><value><int>4</int></value><value><string>Hello</string></value></data></array>')),
		[4, "Hello"],
		"Simple array decodes");

		deepEqual($.xmlrpc.parseNode(el('<array><data/></array>')),
			[],
			"Empty array decodes");

		deepEqual(
			$.xmlrpc.parseNode(el(
				'<array><data>' +
					'<value><int>1</int></value>' +
					'<value><array><data>' +
						'<value><int>2</int></value>' +
					'</data></array></value>' +
				'</data></array>'
			)),
			[1, [2]],
			"Array containing array encodes");

		// Childless value nodes should be treated like string nodes
		deepEqual(
			$.xmlrpc.parseNode(el(
				'<array><data>' +
					'<value><string>String node</string></value>' +
					'<value></value>' +
					'<value>Raw value string</value>' +
				'</data></array>'
			)),
			["String node", "", "Raw value string"],
			"Array containing childless <value> nodes parses correctly");
	});

	test("Struct decoding", function($xml) {
		deepEqual(
			$.xmlrpc.parseNode(el(
				'<struct>' +
					'<member>' +
						'<name>foo</name>' +
						'<value><i4>4</i4></value>' +
					'</member>' +
					'<member>' +
						'<name>bar</name>' +
						'<value><string>Hello</string></value>' +
					'</member>' +
				'</struct>')),
			{foo: 4, bar: "Hello"},
			"Simple <struct> decodes");

		deepEqual($.xmlrpc.parseNode(el('<struct></struct>')), {},
			"Empty <struct> decodes");

		deepEqual(
			$.xmlrpc.parseNode(el(
				'<struct>' +
					'<member>' +
						'<name>foo</name>' +
						'<value><int>4</int></value>' +
					'</member>' +
					'<member>' +
						'<name>bar</name>' +
						'<value><struct>' +
							'<member>' +
								'<name>baz</name>' +
								'<value><int>5</int></value>' +
							'</member>' +
						'</struct></value>' +
					'</member>' +
				'</struct>')),
			{foo: 4, bar: {baz: 5}},
			"struct containing struct decodes");

		deepEqual(
			$.xmlrpc.parseNode(el(
				'<struct>' +
					'<member>' +
						'<name>stringNode</name>' +
						'<value><string>String node</string></value>' +
					'</member>' +
					'<member>' +
						'<name>emptyValue</name>' +
						'<value></value>' +
					'</member>' +
					'<member>' +
						'<name>rawStringValue</name>' +
						'<value>Raw string value</value>' +
					'</member>' +
				'</struct>')),
			{
				stringNode: "String node",
				emptyValue: "",
				rawStringValue: "Raw string value"
			},
			"Struct with childless <value> nodes parses correctly");
	});

})();
