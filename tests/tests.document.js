/*jshint browser:true jquery:true */
/*globals deepEqual equal ok assert test module throws */
(function() {
	"use strict";
	module("Document");

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

	test("Creating a document", function() {
		equal(s($.xmlrpc.document('method', [4, 'foo'])),
			'<methodCall>' +
				'<methodName>method</methodName>' +
				'<params>' +
					'<param><value><int>4</int></value></param>' +
					'<param><value><string>foo</string></value></param>' +
				'</params>' +
			'</methodCall>',
			'Can create a simple document');

		equal(s($.xmlrpc.document('empty', [])),
			'<methodCall>' +
				'<methodName>empty</methodName>' +
				'<params/>' +
			'</methodCall>',
			'Can create an empty document');
	});

	test("Decoding a document", function() {

		deepEqual(
			$.xmlrpc.parseDocument(d(
				'<?xml version="1.0"?>' +
				'<methodResponse>' +
					'<params>' +
						'<param><value><int>4</int></value></param>' +
						'<param><value><string>Hello</string></value></param>' +
					'</params>' +
				'</methodResponse>')),
			[4, "Hello"],
			"Can parse a simple response");

		deepEqual(
			$.xmlrpc.parseDocument(d(
				'<?xml version="1.0"?>' +
				'<methodResponse>' +
					'<params></params>' +
				'</methodResponse>')),
			[],
			"Can parse an empty response");

		deepEqual(
			$.xmlrpc.parseDocument(d(
				'<?xml version="1.0"?>' +
				'<methodResponse>' +
					'<params>' +
						'<param><value><int>4</int></value></param>' +
						'<param><value><array><data>' +
							'<value><int>1</int></value>' +
							'<value><array><data>' +
								'<value><int>2</int></value>' +
							'</data></array></value>' +
						'</data></array></value></param>' +
					'</params>' +
				'</methodResponse>')),
			[4, [1, [2]]],
			"Can parse a complex response");

	});

	test("Handling errors", 5, function() {
		throws(
			function() {
				$.xmlrpc.parseDocument(d(
					'<?xml version="1.0"?>' +
					'<methodResponse>' +
						'<fault>' +
							'<value><struct>' +
								'<member>' +
									'<name>faultCode</name>' +
									'<value><int>4</int></value>' +
								'</member>' +
								'<member>' +
									'<name>faultString</name>' +
									'<value><string>Too many parameters.</string></value>' +
								'</member>' +
							'</struct></value>' +
						'</fault>' +
					'</methodResponse>'
				));
			},
			$.xmlrpc.XmlRpcFault,
			"Parsing a fault response throws an error");

		try {
			$.xmlrpc.parseDocument(d(
				'<?xml version="1.0"?>' +
				'<methodResponse>' +
					'<fault>' +
						'<value>' +
							'<struct>' +
								'<member>' +
									'<name>faultCode</name>' +
									'<value><int>4</int></value>' +
								'</member>' +
								'<member>' +
									'<name>faultString</name>' +
									'<value><string>Error message</string></value>' +
								'</member>' +
							'</struct>' +
						'</value>' +
					'</fault>' +
				'</methodResponse>'
			));
			ok(false, "Should have thrown an error");
		} catch (e) {
			equal(e.code, 4, "Error code is present");
			equal(e.type, 4, "Error type is present");

			equal(e.msg, "Error message", "Error message is present");
			equal(e.message, "Error message", "Error message is present");
		}

	});

})();
