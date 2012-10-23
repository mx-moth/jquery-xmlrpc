/*jshint browser:true jquery:true */
/*globals deepEqual equal ok assert test module */
(function() {
	"use strict";
	module("Binary");

	/**
	* Make an array buffer out of an array of ints
	*/
	var makeArrayBuffer = function(uint8s) {
		var ab = new ArrayBuffer(uint8s.length);
		var uint8 = new Uint8Array(ab);

		uint8s.forEach(function(val, i) {
			uint8[i] = val;
		});

		return ab;
	};

	/**
	* A wrapper around `ok` that acts like `equal`, but works on ArrayBuffers
	* Call like:
	*
	*     abEqual(testArrayBuffer, expectedArrayBuffer, message);
	*/
	var abEqual = function(ab1, ab2) {
		var args = [].slice.call(arguments, 2);

		var allGood = (function() {

			var uint81 = new Uint8Array(ab1);
			var uint82 = new Uint8Array(ab2);

			if (uint81.length != uint82.length) return false;

			for (var i = 0; i < uint81.length; i++) {
				if (uint81[i] !== uint82[i]) return false;
			}

			return true;
		})();

		args.unshift(allGood);

		ok.apply(null, args);
	};

	/**
	* Naive range() function. Only supports forward steps
	*/
	var range = function(start, stop) {
		var acc = [];
		for (var i = start; i < stop; i++) {
			acc.push(i);
		}
		return acc;
	};

	test("base64 encoding", function() {
		equal($.xmlrpc.binary.toBase64(makeArrayBuffer([1, 2, 3, 4, 5])), "AQIDBAU=",
			"ArrayBuffer encoded to base64 string");
	});

	test("base64 decoding", function() {
		abEqual($.xmlrpc.binary.fromBase64("AQIDBAU="), makeArrayBuffer([1, 2, 3, 4, 5]),
			"Base64 string decoded into ArrayBuffer");
	});

	test("base64 round trip", function() {
		var max = 20, low, high;
		for (low = 0; low < max; low++) {
			for (high = low + 1; high < max; high++) {
				var ab = makeArrayBuffer(range(low, high));
				abEqual(ab, $.xmlrpc.binary.fromBase64($.xmlrpc.binary.toBase64(ab)),
					"Range from " + low + " to " + high + " encodes and decodes");
			}
		}
	});
})();
