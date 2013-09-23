/*jshint browser:true */
/*globals $ deepEqual equal ok assert test module throws */
(function() {
	"use strict";
	module("Request");

	/**
	* Serialize a Document to a string easily
	*/
	var s = (function() {
		var serializer = new XMLSerializer();
		return function($node) {
			return serializer.serializeToString($node);
		};
	})();

	var d = (function() {
		var parser = new DOMParser();
		return function(xml) {
			return parser.parseFromString(xml, "text/xml");
		};
	})();

	$.mockjax({
		url: '/mock/xmlrpc/hello',
		contentType: 'text/xml',
		responseTime: 1,
		responseText: (
			'<?xml version="1.0"?>' +
			'<methodResponse>' +
				'<params>' +
					'<param><value><int>4</int></value></param>' +
					'<param><value><string>World!</string></value></param>' +
				'</params>' +
			'</methodResponse>'
		)
	});

	$.mockjax({
		url: '/mock/xmlrpc/empty',
		contentType: 'text/xml',
		responseTime: 1,
		responseText: (
			'<?xml version="1.0"?>' +
			'<methodResponse>' +
				'<params>' +
				'</params>' +
			'</methodResponse>'
		)
	});

	asyncTest("Make a simple request", function() {
		expect(2);
		$.xmlrpc("/mock/xmlrpc/hello", {
			'methodName': 'test-method',
			'params': [1, "Hello"],
			'success': function(data, status) {
				deepEqual(this.data,
					"<methodCall><methodName>test-method</methodName><params>" +
						"<param><value><int>1</int></value></param>" +
						"<param><value><string>Hello</string></value></param>" +
					"</params></methodCall>",
					"Request body was encoded correctly!");
				deepEqual(data, [4, 'World!'],
					"Response body was decoded correctly!");
				start();
			},
			'error': function() {
				ok(false, arguments);
			}
		});
	});

	asyncTest("Make a request with no params", function() {
		expect(2);
		$.xmlrpc("/mock/xmlrpc/empty", {
			'methodName': 'test-method',
			'success': function(data, request) {
				deepEqual(this.data,
					"<methodCall><methodName>test-method</methodName><params/>" +
					"</methodCall>",
					"Request body was encoded correctly!");
				deepEqual(data, [],
					"Response body was decoded correctly!");
				start();
			},
			'error': function() {
				ok(false, arguments);
			}
		});
	});

})();
