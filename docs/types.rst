.. _types:

=====
Types
=====

JSON and XML-RPC are two unrelated markup languages, so converting between the
types requires a small understanding of both languages. Luckily, most of the
types have a direct mapping between the two languages.

Encoding and Decoding XML-RPC Documents
---------------------------------------

Use the following table to see how XML-RPC types are mapped to JavaScript
types:

+-------------------------+-----------------+
| XML-RPC                 |  JavaScript     |
+=========================+=================+
| ``<nil>``               | ``null``        |
+-------------------------+-----------------+
| ``<array>``             | ``Array``       |
+-------------------------+-----------------+
| ``<struct>``            | ``Object``      |
+-------------------------+-----------------+
| ``<string>``            | ``String``      |
+-------------------------+-----------------+
| ``<boolean>``           | ``Boolean``     |
+-------------------------+-----------------+
| ``<int>``               | ``Number``      |
+-------------------------+                 |
| ``<i4>``                |                 |
+-------------------------+                 |
| ``<i8>``                |                 |
+-------------------------+                 |
| ``<i16>``               |                 |
+-------------------------+-----------------+
| ``<double>``            | ``Number``      |
+-------------------------+-----------------+
| ``<dateTime.iso8601>``  | ``Date``        |
+-------------------------+-----------------+
| ``<base64>``            | ``ArrayBuffer`` |
+-------------------------+-----------------+

.. note:: JavaScript does not have separate types for integers and floats, it simply
    has ``Number``. As such, it is impossible to tell if ``4`` really means
    ``<int>4</int>`` or ``<double>4</double>``. If this is an issue for you, read on.

Forcing types
~~~~~~~~~~~~~

Some times, the automatic type guessing going from JSON to XML-RPC may not work
for you. The most common source of this problem is in encoding numbers. The
library may sometimes encode a ``Number`` as a ``<int>`` instead of a ``<float>``, as
there is no reliable way of determining what was actually desired.

To force a type, wrap the value in a call to ``$.xmlrpc.force``.  The types are
named after their XML-RPC equivalents, as mentioned in the above table.


To force a floating point JavaScript ``Number``
to be encoded as an ``<i8>``
and sent as a parameter, use the following:

.. code-block:: javascript

   var forcedValue = $.xmlrpc.force('i8', 4.5)

   $.xmlrpc({
       url: '/RPC2',
       methodName: 'foo',
       params: [forcedValue]
   });

Adding and Extending Types
--------------------------

You can add your own types to XML-RPC by adding a member to ``$.xmlrpc.types``,
combined with the ``$.xmlrpc.makeType`` function. See
:ref:`xmlrpc-makeType` for more information
