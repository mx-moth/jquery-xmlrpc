.. _installing:

==========
Installing
==========

Simply include the jQuery library, and this library in your page:

.. code-block:: html

   <script src="jquery-1.8.1.js"></script>
   <script src="jquery.xmlrpc.js"></script>

This was built upon jQuery 1.8.1. It will probably work with old versions, and
will probably continue to work with new versions.

.. _using:

=====
Using
=====

The ``jQuery.xmlrpc`` function is the main work-horse of this library.
Call it like so:

.. code-block:: javascript

   $.xmlrpc({
       url: '/RPC2',
       methodName: 'foo',
       params: ['bar', 1, 4.6, true, [1, 2, 3], {name: 'value'}],
       success: function(response, status, jqXHR) { },
       error: function(jqXHR, status, error) { }
   });

It takes all of the same arguments as ``jQuery.ajax``,
so refer there for more documentation.
The two new keys added are:

``methodName``
   This is method put in the ``<methodName>`` element from XML-RPC. It should be a
   string. The XML-RPC service you are communicating with will determine valid
   method names you can call.

``params``
   An array of parameters to send. Specify an empty array, or do not supply this
   key at all if you do not want to send any parameters.

   See the docs section on [Encoding and Decoding XML-RPC Documents][encoding] for
   more information.

Getting data back
-----------------

When the XML-RPC call returns,
the contents of the ``<params>`` element are parsed into JSON and
supplied to the ``success`` callback of the AJAX call as the first parameter,
much like a JSON request.

Handling errors
---------------

If any HTTP errors occur during transport,
the normal jQuery AJAX error handling will be used.
If the XML-RPC service successfully replies,
but replies with a ``<fault>`` response,
an ``$.xmlrpc.XmlRpcFault`` is thrown.
This error will be sent as the third parameter to the ``error`` callback
of the AJAX call, as with other errors.
