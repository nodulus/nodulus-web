System.register([], function (_export) {
	var window, Paho;
	return {
		setters: [],
		execute: function () {
			/*******************************************************************************
    * Copyright (c) 2013 IBM Corp.
    *
    * All rights reserved. This program and the accompanying materials
    * are made available under the terms of the Eclipse Public License v1.0
    * and Eclipse Distribution License v1.0 which accompany this distribution. 
    *
    * The Eclipse Public License is available at 
    *    http://www.eclipse.org/legal/epl-v10.html
    * and the Eclipse Distribution License is available at 
    *   http://www.eclipse.org/org/documents/edl-v10.php.
    *
    * Contributors:
    *    Andrew Banks - initial API and implementation and initial documentation
    *******************************************************************************/

			// Only expose a single object name in the global namespace.
			// Everything must go through this module. Global Paho.MQTT module
			// only has a single public function, client, which returns
			// a Paho.MQTT client object given connection details.

			/**
    * Send and receive messages using web browsers.
    * <p> 
    * This programming interface lets a JavaScript client application use the MQTT V3.1 or
    * V3.1.1 protocol to connect to an MQTT-supporting messaging server.
    *  
    * The function supported includes:
    * <ol>
    * <li>Connecting to and disconnecting from a server. The server is identified by its host name and port number. 
    * <li>Specifying options that relate to the communications link with the server, 
    * for example the frequency of keep-alive heartbeats, and whether SSL/TLS is required.
    * <li>Subscribing to and receiving messages from MQTT Topics.
    * <li>Publishing messages to MQTT Topics.
    * </ol>
    * <p>
    * The API consists of two main objects:
    * <dl>
    * <dt><b>{@link Paho.MQTT.Client}</b></dt>
    * <dd>This contains methods that provide the functionality of the API,
    * including provision of callbacks that notify the application when a message
    * arrives from or is delivered to the messaging server,
    * or when the status of its connection to the messaging server changes.</dd>
    * <dt><b>{@link Paho.MQTT.Message}</b></dt>
    * <dd>This encapsulates the payload of the message along with various attributes
    * associated with its delivery, in particular the destination to which it has
    * been (or is about to be) sent.</dd>
    * </dl> 
    * <p>
    * The programming interface validates parameters passed to it, and will throw
    * an Error containing an error message intended for developer use, if it detects
    * an error with any parameter.
    * <p>
    * Example:
    * 
    * <code><pre>
   client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
   client.onConnectionLost = onConnectionLost;
   client.onMessageArrived = onMessageArrived;
   client.connect({onSuccess:onConnect});
   
   function onConnect() {
     // Once a connection has been made, make a subscription and send a message.
     console.log("onConnect");
     client.subscribe("/World");
     message = new Paho.MQTT.Message("Hello");
     message.destinationName = "/World";
     client.send(message); 
   };
   function onConnectionLost(responseObject) {
     if (responseObject.errorCode !== 0)
   	console.log("onConnectionLost:"+responseObject.errorMessage);
   };
   function onMessageArrived(message) {
     console.log("onMessageArrived:"+message.payloadString);
     client.disconnect(); 
   };	
    * </pre></code>
    * @namespace Paho.MQTT 
    */

			"use strict";

			window = global;
			Paho = {};

			Paho.MQTT = (function (global) {

				// Private variables below, these are only visible inside the function closure
				// which is used to define the module.

				var version = "@VERSION@";
				var buildLevel = "@BUILDLEVEL@";

				/** 
     * Unique message type identifiers, with associated
     * associated integer values.
     * @private 
     */
				var MESSAGE_TYPE = {
					CONNECT: 1,
					CONNACK: 2,
					PUBLISH: 3,
					PUBACK: 4,
					PUBREC: 5,
					PUBREL: 6,
					PUBCOMP: 7,
					SUBSCRIBE: 8,
					SUBACK: 9,
					UNSUBSCRIBE: 10,
					UNSUBACK: 11,
					PINGREQ: 12,
					PINGRESP: 13,
					DISCONNECT: 14
				};

				// Collection of utility methods used to simplify module code
				// and promote the DRY pattern. 

				/**
     * Validate an object's parameter names to ensure they 
     * match a list of expected variables name for this option
     * type. Used to ensure option object passed into the API don't
     * contain erroneous parameters.
     * @param {Object} obj - User options object
     * @param {Object} keys - valid keys and types that may exist in obj. 
     * @throws {Error} Invalid option parameter found. 
     * @private 
     */
				var validate = function validate(obj, keys) {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							if (keys.hasOwnProperty(key)) {
								if (typeof obj[key] !== keys[key]) throw new Error(format(ERROR.INVALID_TYPE, [typeof obj[key], key]));
							} else {
								var errorStr = "Unknown property, " + key + ". Valid properties are:";
								for (var key in keys) if (keys.hasOwnProperty(key)) errorStr = errorStr + " " + key;
								throw new Error(errorStr);
							}
						}
					}
				};

				/**
     * Return a new function which runs the user function bound
     * to a fixed scope. 
     * @param {function} User function
     * @param {object} Function scope  
     * @return {function} User function bound to another scope
     * @private 
     */
				var scope = (function (_scope) {
					var _scopeWrapper = function scope(_x, _x2) {
						return _scope.apply(this, arguments);
					};

					_scopeWrapper.toString = function () {
						return _scope.toString();
					};

					return _scopeWrapper;
				})(function (f, scope) {
					return function () {
						return f.apply(scope, arguments);
					};
				});

				/** 
     * Unique message type identifiers, with associated
     * associated integer values.
     * @private 
     */
				var ERROR = {
					OK: { code: 0, text: "AMQJSC0000I OK." },
					CONNECT_TIMEOUT: { code: 1, text: "AMQJSC0001E Connect timed out." },
					SUBSCRIBE_TIMEOUT: { code: 2, text: "AMQJS0002E Subscribe timed out." },
					UNSUBSCRIBE_TIMEOUT: { code: 3, text: "AMQJS0003E Unsubscribe timed out." },
					PING_TIMEOUT: { code: 4, text: "AMQJS0004E Ping timed out." },
					INTERNAL_ERROR: { code: 5, text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}" },
					CONNACK_RETURNCODE: { code: 6, text: "AMQJS0006E Bad Connack return code:{0} {1}." },
					SOCKET_ERROR: { code: 7, text: "AMQJS0007E Socket error:{0}." },
					SOCKET_CLOSE: { code: 8, text: "AMQJS0008I Socket closed." },
					MALFORMED_UTF: { code: 9, text: "AMQJS0009E Malformed UTF data:{0} {1} {2}." },
					UNSUPPORTED: { code: 10, text: "AMQJS0010E {0} is not supported by this browser." },
					INVALID_STATE: { code: 11, text: "AMQJS0011E Invalid state {0}." },
					INVALID_TYPE: { code: 12, text: "AMQJS0012E Invalid type {0} for {1}." },
					INVALID_ARGUMENT: { code: 13, text: "AMQJS0013E Invalid argument {0} for {1}." },
					UNSUPPORTED_OPERATION: { code: 14, text: "AMQJS0014E Unsupported operation." },
					INVALID_STORED_DATA: { code: 15, text: "AMQJS0015E Invalid data in local storage key={0} value={1}." },
					INVALID_MQTT_MESSAGE_TYPE: { code: 16, text: "AMQJS0016E Invalid MQTT message type {0}." },
					MALFORMED_UNICODE: { code: 17, text: "AMQJS0017E Malformed Unicode string:{0} {1}." } };

				/** CONNACK RC Meaning. */
				var CONNACK_RC = {
					0: "Connection Accepted",
					1: "Connection Refused: unacceptable protocol version",
					2: "Connection Refused: identifier rejected",
					3: "Connection Refused: server unavailable",
					4: "Connection Refused: bad user name or password",
					5: "Connection Refused: not authorized"
				};

				/**
     * Format an error message text.
     * @private
     * @param {error} ERROR.KEY value above.
     * @param {substitutions} [array] substituted into the text.
     * @return the text with the substitutions made.
     */
				var format = function format(error, substitutions) {
					var text = error.text;
					if (substitutions) {
						var field, start;
						for (var i = 0; i < substitutions.length; i++) {
							field = "{" + i + "}";
							start = text.indexOf(field);
							if (start > 0) {
								var part1 = text.substring(0, start);
								var part2 = text.substring(start + field.length);
								text = part1 + substitutions[i] + part2;
							}
						}
					}
					return text;
				};

				//MQTT protocol and version          6    M    Q    I    s    d    p    3
				var MqttProtoIdentifierv3 = [0, 6, 77, 81, 73, 115, 100, 112, 3];
				//MQTT proto/version for 311         4    M    Q    T    T    4
				var MqttProtoIdentifierv4 = [0, 4, 77, 81, 84, 84, 4];

				/**
     * Construct an MQTT wire protocol message.
     * @param type MQTT packet type.
     * @param options optional wire message attributes.
     * 
     * Optional properties
     * 
     * messageIdentifier: message ID in the range [0..65535]
     * payloadMessage:	Application Message - PUBLISH only
     * connectStrings:	array of 0 or more Strings to be put into the CONNECT payload
     * topics:			array of strings (SUBSCRIBE, UNSUBSCRIBE)
     * requestQoS:		array of QoS values [0..2]
     *  
     * "Flag" properties 
     * cleanSession:	true if present / false if absent (CONNECT)
     * willMessage:  	true if present / false if absent (CONNECT)
     * isRetained:		true if present / false if absent (CONNECT)
     * userName:		true if present / false if absent (CONNECT)
     * password:		true if present / false if absent (CONNECT)
     * keepAliveInterval:	integer [0..65535]  (CONNECT)
     *
     * @private
     * @ignore
     */
				var WireMessage = function WireMessage(type, options) {
					this.type = type;
					for (var name in options) {
						if (options.hasOwnProperty(name)) {
							this[name] = options[name];
						}
					}
				};

				WireMessage.prototype.encode = function () {
					// Compute the first byte of the fixed header
					var first = (this.type & 15) << 4;

					/*
      * Now calculate the length of the variable header + payload by adding up the lengths
      * of all the component parts
      */

					var remLength = 0;
					var topicStrLength = new Array();
					var destinationNameLength = 0;

					// if the message contains a messageIdentifier then we need two bytes for that
					if (this.messageIdentifier != undefined) remLength += 2;

					switch (this.type) {
						// If this a Connect then we need to include 12 bytes for its header
						case MESSAGE_TYPE.CONNECT:
							switch (this.mqttVersion) {
								case 3:
									remLength += MqttProtoIdentifierv3.length + 3;
									break;
								case 4:
									remLength += MqttProtoIdentifierv4.length + 3;
									break;
							}

							remLength += UTF8Length(this.clientId) + 2;
							if (this.willMessage != undefined) {
								remLength += UTF8Length(this.willMessage.destinationName) + 2;
								// Will message is always a string, sent as UTF-8 characters with a preceding length.
								var willMessagePayloadBytes = this.willMessage.payloadBytes;
								if (!(willMessagePayloadBytes instanceof Uint8Array)) willMessagePayloadBytes = new Uint8Array(payloadBytes);
								remLength += willMessagePayloadBytes.byteLength + 2;
							}
							if (this.userName != undefined) remLength += UTF8Length(this.userName) + 2;
							if (this.password != undefined) remLength += UTF8Length(this.password) + 2;
							break;

						// Subscribe, Unsubscribe can both contain topic strings
						case MESSAGE_TYPE.SUBSCRIBE:
							first |= 2; // Qos = 1;
							for (var i = 0; i < this.topics.length; i++) {
								topicStrLength[i] = UTF8Length(this.topics[i]);
								remLength += topicStrLength[i] + 2;
							}
							remLength += this.requestedQos.length; // 1 byte for each topic's Qos
							// QoS on Subscribe only
							break;

						case MESSAGE_TYPE.UNSUBSCRIBE:
							first |= 2; // Qos = 1;
							for (var i = 0; i < this.topics.length; i++) {
								topicStrLength[i] = UTF8Length(this.topics[i]);
								remLength += topicStrLength[i] + 2;
							}
							break;

						case MESSAGE_TYPE.PUBREL:
							first |= 2; // Qos = 1;
							break;

						case MESSAGE_TYPE.PUBLISH:
							if (this.payloadMessage.duplicate) first |= 8;
							first = first |= this.payloadMessage.qos << 1;
							if (this.payloadMessage.retained) first |= 1;
							destinationNameLength = UTF8Length(this.payloadMessage.destinationName);
							remLength += destinationNameLength + 2;
							var payloadBytes = this.payloadMessage.payloadBytes;
							remLength += payloadBytes.byteLength;
							if (payloadBytes instanceof ArrayBuffer) payloadBytes = new Uint8Array(payloadBytes);else if (!(payloadBytes instanceof Uint8Array)) payloadBytes = new Uint8Array(payloadBytes.buffer);
							break;

						case MESSAGE_TYPE.DISCONNECT:
							break;

						default:
							;
					}

					// Now we can allocate a buffer for the message

					var mbi = encodeMBI(remLength); // Convert the length to MQTT MBI format
					var pos = mbi.length + 1; // Offset of start of variable header
					var buffer = new ArrayBuffer(remLength + pos);
					var byteStream = new Uint8Array(buffer); // view it as a sequence of bytes

					//Write the fixed header into the buffer
					byteStream[0] = first;
					byteStream.set(mbi, 1);

					// If this is a PUBLISH then the variable header starts with a topic
					if (this.type == MESSAGE_TYPE.PUBLISH) pos = writeString(this.payloadMessage.destinationName, destinationNameLength, byteStream, pos);
					// If this is a CONNECT then the variable header contains the protocol name/version, flags and keepalive time

					else if (this.type == MESSAGE_TYPE.CONNECT) {
						switch (this.mqttVersion) {
							case 3:
								byteStream.set(MqttProtoIdentifierv3, pos);
								pos += MqttProtoIdentifierv3.length;
								break;
							case 4:
								byteStream.set(MqttProtoIdentifierv4, pos);
								pos += MqttProtoIdentifierv4.length;
								break;
						}
						var connectFlags = 0;
						if (this.cleanSession) connectFlags = 2;
						if (this.willMessage != undefined) {
							connectFlags |= 4;
							connectFlags |= this.willMessage.qos << 3;
							if (this.willMessage.retained) {
								connectFlags |= 32;
							}
						}
						if (this.userName != undefined) connectFlags |= 128;
						if (this.password != undefined) connectFlags |= 64;
						byteStream[pos++] = connectFlags;
						pos = writeUint16(this.keepAliveInterval, byteStream, pos);
					}

					// Output the messageIdentifier - if there is one
					if (this.messageIdentifier != undefined) pos = writeUint16(this.messageIdentifier, byteStream, pos);

					switch (this.type) {
						case MESSAGE_TYPE.CONNECT:
							pos = writeString(this.clientId, UTF8Length(this.clientId), byteStream, pos);
							if (this.willMessage != undefined) {
								pos = writeString(this.willMessage.destinationName, UTF8Length(this.willMessage.destinationName), byteStream, pos);
								pos = writeUint16(willMessagePayloadBytes.byteLength, byteStream, pos);
								byteStream.set(willMessagePayloadBytes, pos);
								pos += willMessagePayloadBytes.byteLength;
							}
							if (this.userName != undefined) pos = writeString(this.userName, UTF8Length(this.userName), byteStream, pos);
							if (this.password != undefined) pos = writeString(this.password, UTF8Length(this.password), byteStream, pos);
							break;

						case MESSAGE_TYPE.PUBLISH:
							// PUBLISH has a text or binary payload, if text do not add a 2 byte length field, just the UTF characters.	
							byteStream.set(payloadBytes, pos);

							break;

						//    	    case MESSAGE_TYPE.PUBREC:	
						//    	    case MESSAGE_TYPE.PUBREL:	
						//    	    case MESSAGE_TYPE.PUBCOMP:	
						//    	    	break;

						case MESSAGE_TYPE.SUBSCRIBE:
							// SUBSCRIBE has a list of topic strings and request QoS
							for (var i = 0; i < this.topics.length; i++) {
								pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
								byteStream[pos++] = this.requestedQos[i];
							}
							break;

						case MESSAGE_TYPE.UNSUBSCRIBE:
							// UNSUBSCRIBE has a list of topic strings
							for (var i = 0; i < this.topics.length; i++) pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
							break;

						default:
						// Do nothing.
					}

					return buffer;
				};

				function decodeMessage(input, pos) {
					var startingPos = pos;
					var first = input[pos];
					var type = first >> 4;
					var messageInfo = first &= 15;
					pos += 1;

					// Decode the remaining length (MBI format)

					var digit;
					var remLength = 0;
					var multiplier = 1;
					do {
						if (pos == input.length) {
							return [null, startingPos];
						}
						digit = input[pos++];
						remLength += (digit & 127) * multiplier;
						multiplier *= 128;
					} while ((digit & 128) != 0);

					var endPos = pos + remLength;
					if (endPos > input.length) {
						return [null, startingPos];
					}

					var wireMessage = new WireMessage(type);
					switch (type) {
						case MESSAGE_TYPE.CONNACK:
							var connectAcknowledgeFlags = input[pos++];
							if (connectAcknowledgeFlags & 1) wireMessage.sessionPresent = true;
							wireMessage.returnCode = input[pos++];
							break;

						case MESSAGE_TYPE.PUBLISH:
							var qos = messageInfo >> 1 & 3;

							var len = readUint16(input, pos);
							pos += 2;
							var topicName = parseUTF8(input, pos, len);
							pos += len;
							// If QoS 1 or 2 there will be a messageIdentifier
							if (qos > 0) {
								wireMessage.messageIdentifier = readUint16(input, pos);
								pos += 2;
							}

							var message = new Paho.MQTT.Message(input.subarray(pos, endPos));
							if ((messageInfo & 1) == 1) message.retained = true;
							if ((messageInfo & 8) == 8) message.duplicate = true;
							message.qos = qos;
							message.destinationName = topicName;
							wireMessage.payloadMessage = message;
							break;

						case MESSAGE_TYPE.PUBACK:
						case MESSAGE_TYPE.PUBREC:
						case MESSAGE_TYPE.PUBREL:
						case MESSAGE_TYPE.PUBCOMP:
						case MESSAGE_TYPE.UNSUBACK:
							wireMessage.messageIdentifier = readUint16(input, pos);
							break;

						case MESSAGE_TYPE.SUBACK:
							wireMessage.messageIdentifier = readUint16(input, pos);
							pos += 2;
							wireMessage.returnCode = input.subarray(pos, endPos);
							break;

						default:
							;
					}

					return [wireMessage, endPos];
				}

				function writeUint16(input, buffer, offset) {
					buffer[offset++] = input >> 8; //MSB
					buffer[offset++] = input % 256; //LSB
					return offset;
				}

				function writeString(input, utf8Length, buffer, offset) {
					offset = writeUint16(utf8Length, buffer, offset);
					stringToUTF8(input, buffer, offset);
					return offset + utf8Length;
				}

				function readUint16(buffer, offset) {
					return 256 * buffer[offset] + buffer[offset + 1];
				}

				/**
     * Encodes an MQTT Multi-Byte Integer
     * @private 
     */
				function encodeMBI(number) {
					var output = new Array(1);
					var numBytes = 0;

					do {
						var digit = number % 128;
						number = number >> 7;
						if (number > 0) {
							digit |= 128;
						}
						output[numBytes++] = digit;
					} while (number > 0 && numBytes < 4);

					return output;
				}

				/**
     * Takes a String and calculates its length in bytes when encoded in UTF8.
     * @private
     */
				function UTF8Length(input) {
					var output = 0;
					for (var i = 0; i < input.length; i++) {
						var charCode = input.charCodeAt(i);
						if (charCode > 2047) {
							// Surrogate pair means its a 4 byte character
							if (55296 <= charCode && charCode <= 56319) {
								i++;
								output++;
							}
							output += 3;
						} else if (charCode > 127) output += 2;else output++;
					}
					return output;
				}

				/**
     * Takes a String and writes it into an array as UTF8 encoded bytes.
     * @private
     */
				function stringToUTF8(input, output, start) {
					var pos = start;
					for (var i = 0; i < input.length; i++) {
						var charCode = input.charCodeAt(i);

						// Check for a surrogate pair.
						if (55296 <= charCode && charCode <= 56319) {
							var lowCharCode = input.charCodeAt(++i);
							if (isNaN(lowCharCode)) {
								throw new Error(format(ERROR.MALFORMED_UNICODE, [charCode, lowCharCode]));
							}
							charCode = (charCode - 55296 << 10) + (lowCharCode - 56320) + 65536;
						}

						if (charCode <= 127) {
							output[pos++] = charCode;
						} else if (charCode <= 2047) {
							output[pos++] = charCode >> 6 & 31 | 192;
							output[pos++] = charCode & 63 | 128;
						} else if (charCode <= 65535) {
							output[pos++] = charCode >> 12 & 15 | 224;
							output[pos++] = charCode >> 6 & 63 | 128;
							output[pos++] = charCode & 63 | 128;
						} else {
							output[pos++] = charCode >> 18 & 7 | 240;
							output[pos++] = charCode >> 12 & 63 | 128;
							output[pos++] = charCode >> 6 & 63 | 128;
							output[pos++] = charCode & 63 | 128;
						};
					}
					return output;
				}

				function parseUTF8(input, offset, length) {
					var output = "";
					var utf16;
					var pos = offset;

					while (pos < offset + length) {
						var byte1 = input[pos++];
						if (byte1 < 128) utf16 = byte1;else {
							var byte2 = input[pos++] - 128;
							if (byte2 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), ""]));
							if (byte1 < 224) // 2 byte character
								utf16 = 64 * (byte1 - 192) + byte2;else {
								var byte3 = input[pos++] - 128;
								if (byte3 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16)]));
								if (byte1 < 240) // 3 byte character
									utf16 = 4096 * (byte1 - 224) + 64 * byte2 + byte3;else {
									var byte4 = input[pos++] - 128;
									if (byte4 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
									if (byte1 < 248) // 4 byte character
										utf16 = 262144 * (byte1 - 240) + 4096 * byte2 + 64 * byte3 + byte4;else // longer encodings are not supported 
										throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
								}
							}
						}

						if (utf16 > 65535) // 4 byte character - express as a surrogate pair
							{
								utf16 -= 65536;
								output += String.fromCharCode(55296 + (utf16 >> 10)); // lead character
								utf16 = 56320 + (utf16 & 1023); // trail character
							}
						output += String.fromCharCode(utf16);
					}
					return output;
				}

				/** 
     * Repeat keepalive requests, monitor responses.
     * @ignore
     */
				var Pinger = function Pinger(client, window, keepAliveInterval) {
					this._client = client;
					this._window = window;
					this._keepAliveInterval = keepAliveInterval * 1000;
					this.isReset = false;

					var pingReq = new WireMessage(MESSAGE_TYPE.PINGREQ).encode();

					var doTimeout = function doTimeout(pinger) {
						return function () {
							return doPing.apply(pinger);
						};
					};

					/** @ignore */
					var doPing = function doPing() {
						if (!this.isReset) {
							this._client._trace("Pinger.doPing", "Timed out");
							this._client._disconnected(ERROR.PING_TIMEOUT.code, format(ERROR.PING_TIMEOUT));
						} else {
							this.isReset = false;
							this._client._trace("Pinger.doPing", "send PINGREQ");
							this._client.socket.send(pingReq);
							this.timeout = this._window.setTimeout(doTimeout(this), this._keepAliveInterval);
						}
					};

					this.reset = function () {
						this.isReset = true;
						this._window.clearTimeout(this.timeout);
						if (this._keepAliveInterval > 0) this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
					};

					this.cancel = function () {
						this._window.clearTimeout(this.timeout);
					};
				};

				/**
     * Monitor request completion.
     * @ignore
     */
				var Timeout = function Timeout(client, window, timeoutSeconds, action, args) {
					this._window = window;
					if (!timeoutSeconds) timeoutSeconds = 30;

					var doTimeout = function doTimeout(action, client, args) {
						return function () {
							return action.apply(client, args);
						};
					};
					this.timeout = setTimeout(doTimeout(action, client, args), timeoutSeconds * 1000);

					this.cancel = function () {
						this._window.clearTimeout(this.timeout);
					};
				};

				/*
     * Internal implementation of the Websockets MQTT V3.1 client.
     * 
     * @name Paho.MQTT.ClientImpl @constructor 
     * @param {String} host the DNS nameof the webSocket host. 
     * @param {Number} port the port number for that host.
     * @param {String} clientId the MQ client identifier.
     */
				var ClientImpl = function ClientImpl(uri, host, port, path, clientId) {
					// Check dependencies are satisfied in this browser.
					if (!("WebSocket" in global && global.WebSocket !== null)) {
						throw new Error(format(ERROR.UNSUPPORTED, ["WebSocket"]));
					}
					if (!("localStorage" in global && global.localStorage !== null)) {
						throw new Error(format(ERROR.UNSUPPORTED, ["localStorage"]));
					}
					if (!("ArrayBuffer" in global && global.ArrayBuffer !== null)) {
						throw new Error(format(ERROR.UNSUPPORTED, ["ArrayBuffer"]));
					}
					this._trace("Paho.MQTT.Client", uri, host, port, path, clientId);

					this.host = host;
					this.port = port;
					this.path = path;
					this.uri = uri;
					this.clientId = clientId;

					// Local storagekeys are qualified with the following string.
					// The conditional inclusion of path in the key is for backward
					// compatibility to when the path was not configurable and assumed to
					// be /mqtt
					this._localKey = host + ":" + port + (path != "/mqtt" ? ":" + path : "") + ":" + clientId + ":";

					// Create private instance-only message queue
					// Internal queue of messages to be sent, in sending order.
					this._msg_queue = [];

					// Messages we have sent and are expecting a response for, indexed by their respective message ids.
					this._sentMessages = {};

					// Messages we have received and acknowleged and are expecting a confirm message for
					// indexed by their respective message ids.
					this._receivedMessages = {};

					// Internal list of callbacks to be executed when messages
					// have been successfully sent over web socket, e.g. disconnect
					// when it doesn't have to wait for ACK, just message is dispatched.
					this._notify_msg_sent = {};

					// Unique identifier for SEND messages, incrementing
					// counter as messages are sent.
					this._message_identifier = 1;

					// Used to determine the transmission sequence of stored sent messages.
					this._sequence = 0;

					// Load the local state, if any, from the saved version, only restore state relevant to this client.   	
					for (var key in localStorage) if (key.indexOf("Sent:" + this._localKey) == 0 || key.indexOf("Received:" + this._localKey) == 0) this.restore(key);
				};

				// Messaging Client public instance members.
				ClientImpl.prototype.host;
				ClientImpl.prototype.port;
				ClientImpl.prototype.path;
				ClientImpl.prototype.uri;
				ClientImpl.prototype.clientId;

				// Messaging Client private instance members.
				ClientImpl.prototype.socket;
				/* true once we have received an acknowledgement to a CONNECT packet. */
				ClientImpl.prototype.connected = false;
				/* The largest message identifier allowed, may not be larger than 2**16 but 
     * if set smaller reduces the maximum number of outbound messages allowed.
     */
				ClientImpl.prototype.maxMessageIdentifier = 65536;
				ClientImpl.prototype.connectOptions;
				ClientImpl.prototype.hostIndex;
				ClientImpl.prototype.onConnectionLost;
				ClientImpl.prototype.onMessageDelivered;
				ClientImpl.prototype.onMessageArrived;
				ClientImpl.prototype.traceFunction;
				ClientImpl.prototype._msg_queue = null;
				ClientImpl.prototype._connectTimeout;
				/* The sendPinger monitors how long we allow before we send data to prove to the server that we are alive. */
				ClientImpl.prototype.sendPinger = null;
				/* The receivePinger monitors how long we allow before we require evidence that the server is alive. */
				ClientImpl.prototype.receivePinger = null;

				ClientImpl.prototype.receiveBuffer = null;

				ClientImpl.prototype._traceBuffer = null;
				ClientImpl.prototype._MAX_TRACE_ENTRIES = 100;

				ClientImpl.prototype.connect = function (connectOptions) {
					var connectOptionsMasked = this._traceMask(connectOptions, "password");
					this._trace("Client.connect", connectOptionsMasked, this.socket, this.connected);

					if (this.connected) throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
					if (this.socket) throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));

					this.connectOptions = connectOptions;

					if (connectOptions.uris) {
						this.hostIndex = 0;
						this._doConnect(connectOptions.uris[0]);
					} else {
						this._doConnect(this.uri);
					}
				};

				ClientImpl.prototype.subscribe = function (filter, subscribeOptions) {
					this._trace("Client.subscribe", filter, subscribeOptions);

					if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));

					var wireMessage = new WireMessage(MESSAGE_TYPE.SUBSCRIBE);
					wireMessage.topics = [filter];
					if (subscribeOptions.qos != undefined) wireMessage.requestedQos = [subscribeOptions.qos];else wireMessage.requestedQos = [0];

					if (subscribeOptions.onSuccess) {
						wireMessage.onSuccess = function (grantedQos) {
							subscribeOptions.onSuccess({ invocationContext: subscribeOptions.invocationContext, grantedQos: grantedQos });
						};
					}

					if (subscribeOptions.onFailure) {
						wireMessage.onFailure = function (errorCode) {
							subscribeOptions.onFailure({ invocationContext: subscribeOptions.invocationContext, errorCode: errorCode });
						};
					}

					if (subscribeOptions.timeout) {
						wireMessage.timeOut = new Timeout(this, window, subscribeOptions.timeout, subscribeOptions.onFailure, [{ invocationContext: subscribeOptions.invocationContext,
							errorCode: ERROR.SUBSCRIBE_TIMEOUT.code,
							errorMessage: format(ERROR.SUBSCRIBE_TIMEOUT) }]);
					}

					// All subscriptions return a SUBACK.
					this._requires_ack(wireMessage);
					this._schedule_message(wireMessage);
				};

				/** @ignore */
				ClientImpl.prototype.unsubscribe = function (filter, unsubscribeOptions) {
					this._trace("Client.unsubscribe", filter, unsubscribeOptions);

					if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));

					var wireMessage = new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);
					wireMessage.topics = [filter];

					if (unsubscribeOptions.onSuccess) {
						wireMessage.callback = function () {
							unsubscribeOptions.onSuccess({ invocationContext: unsubscribeOptions.invocationContext });
						};
					}
					if (unsubscribeOptions.timeout) {
						wireMessage.timeOut = new Timeout(this, window, unsubscribeOptions.timeout, unsubscribeOptions.onFailure, [{ invocationContext: unsubscribeOptions.invocationContext,
							errorCode: ERROR.UNSUBSCRIBE_TIMEOUT.code,
							errorMessage: format(ERROR.UNSUBSCRIBE_TIMEOUT) }]);
					}

					// All unsubscribes return a SUBACK.        
					this._requires_ack(wireMessage);
					this._schedule_message(wireMessage);
				};

				ClientImpl.prototype.send = function (message) {
					this._trace("Client.send", message);

					if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));

					var wireMessage = new WireMessage(MESSAGE_TYPE.PUBLISH);
					wireMessage.payloadMessage = message;

					if (message.qos > 0) this._requires_ack(wireMessage);else if (this.onMessageDelivered) this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage);
					this._schedule_message(wireMessage);
				};

				ClientImpl.prototype.disconnect = function () {
					this._trace("Client.disconnect");

					if (!this.socket) throw new Error(format(ERROR.INVALID_STATE, ["not connecting or connected"]));

					var wireMessage = new WireMessage(MESSAGE_TYPE.DISCONNECT);

					// Run the disconnected call back as soon as the message has been sent,
					// in case of a failure later on in the disconnect processing.
					// as a consequence, the _disconected call back may be run several times.
					this._notify_msg_sent[wireMessage] = scope(this._disconnected, this);

					this._schedule_message(wireMessage);
				};

				ClientImpl.prototype.getTraceLog = function () {
					if (this._traceBuffer !== null) {
						this._trace("Client.getTraceLog", new Date());
						this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
						for (var key in this._sentMessages) this._trace("_sentMessages ", key, this._sentMessages[key]);
						for (var key in this._receivedMessages) this._trace("_receivedMessages ", key, this._receivedMessages[key]);

						return this._traceBuffer;
					}
				};

				ClientImpl.prototype.startTrace = function () {
					if (this._traceBuffer === null) {
						this._traceBuffer = [];
					}
					this._trace("Client.startTrace", new Date(), version);
				};

				ClientImpl.prototype.stopTrace = function () {
					delete this._traceBuffer;
				};

				ClientImpl.prototype._doConnect = function (wsurl) {
					// When the socket is open, this client will send the CONNECT WireMessage using the saved parameters.
					if (this.connectOptions.useSSL) {
						var uriParts = wsurl.split(":");
						uriParts[0] = "wss";
						wsurl = uriParts.join(":");
					}
					this.connected = false;
					if (this.connectOptions.mqttVersion < 4) {
						this.socket = new WebSocket(wsurl, ["mqttv3.1"]);
					} else {
						this.socket = new WebSocket(wsurl, ["mqtt"]);
					}
					this.socket.binaryType = "arraybuffer";

					this.socket.onopen = scope(this._on_socket_open, this);
					this.socket.onmessage = scope(this._on_socket_message, this);
					this.socket.onerror = scope(this._on_socket_error, this);
					this.socket.onclose = scope(this._on_socket_close, this);

					this.sendPinger = new Pinger(this, window, this.connectOptions.keepAliveInterval);
					this.receivePinger = new Pinger(this, window, this.connectOptions.keepAliveInterval);

					this._connectTimeout = new Timeout(this, window, this.connectOptions.timeout, this._disconnected, [ERROR.CONNECT_TIMEOUT.code, format(ERROR.CONNECT_TIMEOUT)]);
				};

				// Schedule a new message to be sent over the WebSockets
				// connection. CONNECT messages cause WebSocket connection
				// to be started. All other messages are queued internally
				// until this has happened. When WS connection starts, process
				// all outstanding messages.
				ClientImpl.prototype._schedule_message = function (message) {
					this._msg_queue.push(message);
					// Process outstanding messages in the queue if we have an  open socket, and have received CONNACK.
					if (this.connected) {
						this._process_queue();
					}
				};

				ClientImpl.prototype.store = function (prefix, wireMessage) {
					var storedMessage = { type: wireMessage.type, messageIdentifier: wireMessage.messageIdentifier, version: 1 };

					switch (wireMessage.type) {
						case MESSAGE_TYPE.PUBLISH:
							if (wireMessage.pubRecReceived) storedMessage.pubRecReceived = true;

							// Convert the payload to a hex string.
							storedMessage.payloadMessage = {};
							var hex = "";
							var messageBytes = wireMessage.payloadMessage.payloadBytes;
							for (var i = 0; i < messageBytes.length; i++) {
								if (messageBytes[i] <= 15) hex = hex + "0" + messageBytes[i].toString(16);else hex = hex + messageBytes[i].toString(16);
							}
							storedMessage.payloadMessage.payloadHex = hex;

							storedMessage.payloadMessage.qos = wireMessage.payloadMessage.qos;
							storedMessage.payloadMessage.destinationName = wireMessage.payloadMessage.destinationName;
							if (wireMessage.payloadMessage.duplicate) storedMessage.payloadMessage.duplicate = true;
							if (wireMessage.payloadMessage.retained) storedMessage.payloadMessage.retained = true;

							// Add a sequence number to sent messages.
							if (prefix.indexOf("Sent:") == 0) {
								if (wireMessage.sequence === undefined) wireMessage.sequence = ++this._sequence;
								storedMessage.sequence = wireMessage.sequence;
							}
							break;

						default:
							throw Error(format(ERROR.INVALID_STORED_DATA, [key, storedMessage]));
					}
					localStorage.setItem(prefix + this._localKey + wireMessage.messageIdentifier, JSON.stringify(storedMessage));
				};

				ClientImpl.prototype.restore = function (key) {
					var value = localStorage.getItem(key);
					var storedMessage = JSON.parse(value);

					var wireMessage = new WireMessage(storedMessage.type, storedMessage);

					switch (storedMessage.type) {
						case MESSAGE_TYPE.PUBLISH:
							// Replace the payload message with a Message object.
							var hex = storedMessage.payloadMessage.payloadHex;
							var buffer = new ArrayBuffer(hex.length / 2);
							var byteStream = new Uint8Array(buffer);
							var i = 0;
							while (hex.length >= 2) {
								var x = parseInt(hex.substring(0, 2), 16);
								hex = hex.substring(2, hex.length);
								byteStream[i++] = x;
							}
							var payloadMessage = new Paho.MQTT.Message(byteStream);

							payloadMessage.qos = storedMessage.payloadMessage.qos;
							payloadMessage.destinationName = storedMessage.payloadMessage.destinationName;
							if (storedMessage.payloadMessage.duplicate) payloadMessage.duplicate = true;
							if (storedMessage.payloadMessage.retained) payloadMessage.retained = true;
							wireMessage.payloadMessage = payloadMessage;

							break;

						default:
							throw Error(format(ERROR.INVALID_STORED_DATA, [key, value]));
					}

					if (key.indexOf("Sent:" + this._localKey) == 0) {
						wireMessage.payloadMessage.duplicate = true;
						this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
					} else if (key.indexOf("Received:" + this._localKey) == 0) {
						this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
					}
				};

				ClientImpl.prototype._process_queue = function () {
					var message = null;
					// Process messages in order they were added
					var fifo = this._msg_queue.reverse();

					// Send all queued messages down socket connection
					while (message = fifo.pop()) {
						this._socket_send(message);
						// Notify listeners that message was successfully sent
						if (this._notify_msg_sent[message]) {
							this._notify_msg_sent[message]();
							delete this._notify_msg_sent[message];
						}
					}
				};

				/**
     * Expect an ACK response for this message. Add message to the set of in progress
     * messages and set an unused identifier in this message.
     * @ignore
     */
				ClientImpl.prototype._requires_ack = function (wireMessage) {
					var messageCount = Object.keys(this._sentMessages).length;
					if (messageCount > this.maxMessageIdentifier) throw Error("Too many messages:" + messageCount);

					while (this._sentMessages[this._message_identifier] !== undefined) {
						this._message_identifier++;
					}
					wireMessage.messageIdentifier = this._message_identifier;
					this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
					if (wireMessage.type === MESSAGE_TYPE.PUBLISH) {
						this.store("Sent:", wireMessage);
					}
					if (this._message_identifier === this.maxMessageIdentifier) {
						this._message_identifier = 1;
					}
				};

				/** 
     * Called when the underlying websocket has been opened.
     * @ignore
     */
				ClientImpl.prototype._on_socket_open = function () {
					// Create the CONNECT message object.
					var wireMessage = new WireMessage(MESSAGE_TYPE.CONNECT, this.connectOptions);
					wireMessage.clientId = this.clientId;
					this._socket_send(wireMessage);
				};

				/** 
     * Called when the underlying websocket has received a complete packet.
     * @ignore
     */
				ClientImpl.prototype._on_socket_message = function (event) {
					this._trace("Client._on_socket_message", event.data);
					// Reset the receive ping timer, we now have evidence the server is alive.
					this.receivePinger.reset();
					var messages = this._deframeMessages(event.data);
					for (var i = 0; i < messages.length; i += 1) {
						this._handleMessage(messages[i]);
					}
				};

				ClientImpl.prototype._deframeMessages = function (data) {
					var byteArray = new Uint8Array(data);
					if (this.receiveBuffer) {
						var newData = new Uint8Array(this.receiveBuffer.length + byteArray.length);
						newData.set(this.receiveBuffer);
						newData.set(byteArray, this.receiveBuffer.length);
						byteArray = newData;
						delete this.receiveBuffer;
					}
					try {
						var offset = 0;
						var messages = [];
						while (offset < byteArray.length) {
							var result = decodeMessage(byteArray, offset);
							var wireMessage = result[0];
							offset = result[1];
							if (wireMessage !== null) {
								messages.push(wireMessage);
							} else {
								break;
							}
						}
						if (offset < byteArray.length) {
							this.receiveBuffer = byteArray.subarray(offset);
						}
					} catch (error) {
						this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [error.message, error.stack.toString()]));
						return;
					}
					return messages;
				};

				ClientImpl.prototype._handleMessage = function (wireMessage) {

					this._trace("Client._handleMessage", wireMessage);

					try {
						switch (wireMessage.type) {
							case MESSAGE_TYPE.CONNACK:
								this._connectTimeout.cancel();

								// If we have started using clean session then clear up the local state.
								if (this.connectOptions.cleanSession) {
									for (var key in this._sentMessages) {
										var sentMessage = this._sentMessages[key];
										localStorage.removeItem("Sent:" + this._localKey + sentMessage.messageIdentifier);
									}
									this._sentMessages = {};

									for (var key in this._receivedMessages) {
										var receivedMessage = this._receivedMessages[key];
										localStorage.removeItem("Received:" + this._localKey + receivedMessage.messageIdentifier);
									}
									this._receivedMessages = {};
								}
								// Client connected and ready for business.
								if (wireMessage.returnCode === 0) {
									this.connected = true;
									// Jump to the end of the list of uris and stop looking for a good host.
									if (this.connectOptions.uris) this.hostIndex = this.connectOptions.uris.length;
								} else {
									this._disconnected(ERROR.CONNACK_RETURNCODE.code, format(ERROR.CONNACK_RETURNCODE, [wireMessage.returnCode, CONNACK_RC[wireMessage.returnCode]]));
									break;
								}

								// Resend messages.
								var sequencedMessages = new Array();
								for (var msgId in this._sentMessages) {
									if (this._sentMessages.hasOwnProperty(msgId)) sequencedMessages.push(this._sentMessages[msgId]);
								}

								// Sort sentMessages into the original sent order.
								var sequencedMessages = sequencedMessages.sort(function (a, b) {
									return a.sequence - b.sequence;
								});
								for (var i = 0, len = sequencedMessages.length; i < len; i++) {
									var sentMessage = sequencedMessages[i];
									if (sentMessage.type == MESSAGE_TYPE.PUBLISH && sentMessage.pubRecReceived) {
										var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, { messageIdentifier: sentMessage.messageIdentifier });
										this._schedule_message(pubRelMessage);
									} else {
										this._schedule_message(sentMessage);
									};
								}

								// Execute the connectOptions.onSuccess callback if there is one.
								if (this.connectOptions.onSuccess) {
									this.connectOptions.onSuccess({ invocationContext: this.connectOptions.invocationContext });
								}

								// Process all queued messages now that the connection is established.
								this._process_queue();
								break;

							case MESSAGE_TYPE.PUBLISH:
								this._receivePublish(wireMessage);
								break;

							case MESSAGE_TYPE.PUBACK:
								var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
								// If this is a re flow of a PUBACK after we have restarted receivedMessage will not exist.
								if (sentMessage) {
									delete this._sentMessages[wireMessage.messageIdentifier];
									localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
									if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
								}
								break;

							case MESSAGE_TYPE.PUBREC:
								var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
								// If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
								if (sentMessage) {
									sentMessage.pubRecReceived = true;
									var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, { messageIdentifier: wireMessage.messageIdentifier });
									this.store("Sent:", sentMessage);
									this._schedule_message(pubRelMessage);
								}
								break;

							case MESSAGE_TYPE.PUBREL:
								var receivedMessage = this._receivedMessages[wireMessage.messageIdentifier];
								localStorage.removeItem("Received:" + this._localKey + wireMessage.messageIdentifier);
								// If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
								if (receivedMessage) {
									this._receiveMessage(receivedMessage);
									delete this._receivedMessages[wireMessage.messageIdentifier];
								}
								// Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
								var pubCompMessage = new WireMessage(MESSAGE_TYPE.PUBCOMP, { messageIdentifier: wireMessage.messageIdentifier });
								this._schedule_message(pubCompMessage);
								break;

							case MESSAGE_TYPE.PUBCOMP:
								var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
								delete this._sentMessages[wireMessage.messageIdentifier];
								localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
								if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
								break;

							case MESSAGE_TYPE.SUBACK:
								var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
								if (sentMessage) {
									if (sentMessage.timeOut) sentMessage.timeOut.cancel();
									wireMessage.returnCode.indexOf = Array.prototype.indexOf;
									if (wireMessage.returnCode.indexOf(128) !== -1) {
										if (sentMessage.onFailure) {
											sentMessage.onFailure(wireMessage.returnCode);
										}
									} else if (sentMessage.onSuccess) {
										sentMessage.onSuccess(wireMessage.returnCode);
									}
									delete this._sentMessages[wireMessage.messageIdentifier];
								}
								break;

							case MESSAGE_TYPE.UNSUBACK:
								var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
								if (sentMessage) {
									if (sentMessage.timeOut) sentMessage.timeOut.cancel();
									if (sentMessage.callback) {
										sentMessage.callback();
									}
									delete this._sentMessages[wireMessage.messageIdentifier];
								}

								break;

							case MESSAGE_TYPE.PINGRESP:
								/* The sendPinger or receivePinger may have sent a ping, the receivePinger has already been reset. */
								this.sendPinger.reset();
								break;

							case MESSAGE_TYPE.DISCONNECT:
								// Clients do not expect to receive disconnect packets.
								this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
								break;

							default:
								this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
						};
					} catch (error) {
						this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [error.message, error.stack.toString()]));
						return;
					}
				};

				/** @ignore */
				ClientImpl.prototype._on_socket_error = function (error) {
					this._disconnected(ERROR.SOCKET_ERROR.code, format(ERROR.SOCKET_ERROR, [error.data]));
				};

				/** @ignore */
				ClientImpl.prototype._on_socket_close = function () {
					this._disconnected(ERROR.SOCKET_CLOSE.code, format(ERROR.SOCKET_CLOSE));
				};

				/** @ignore */
				ClientImpl.prototype._socket_send = function (wireMessage) {

					if (wireMessage.type == 1) {
						var wireMessageMasked = this._traceMask(wireMessage, "password");
						this._trace("Client._socket_send", wireMessageMasked);
					} else this._trace("Client._socket_send", wireMessage);

					this.socket.send(wireMessage.encode());
					/* We have proved to the server we are alive. */
					this.sendPinger.reset();
				};

				/** @ignore */
				ClientImpl.prototype._receivePublish = function (wireMessage) {
					switch (wireMessage.payloadMessage.qos) {
						case "undefined":
						case 0:
							this._receiveMessage(wireMessage);
							break;

						case 1:
							var pubAckMessage = new WireMessage(MESSAGE_TYPE.PUBACK, { messageIdentifier: wireMessage.messageIdentifier });
							this._schedule_message(pubAckMessage);
							this._receiveMessage(wireMessage);
							break;

						case 2:
							this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
							this.store("Received:", wireMessage);
							var pubRecMessage = new WireMessage(MESSAGE_TYPE.PUBREC, { messageIdentifier: wireMessage.messageIdentifier });
							this._schedule_message(pubRecMessage);

							break;

						default:
							throw Error("Invaild qos=" + wireMmessage.payloadMessage.qos);
					};
				};

				/** @ignore */
				ClientImpl.prototype._receiveMessage = function (wireMessage) {
					if (this.onMessageArrived) {
						this.onMessageArrived(wireMessage.payloadMessage);
					}
				};

				/**
     * Client has disconnected either at its own request or because the server
     * or network disconnected it. Remove all non-durable state.
     * @param {errorCode} [number] the error number.
     * @param {errorText} [string] the error text.
     * @ignore
     */
				ClientImpl.prototype._disconnected = function (errorCode, errorText) {
					this._trace("Client._disconnected", errorCode, errorText);

					this.sendPinger.cancel();
					this.receivePinger.cancel();
					if (this._connectTimeout) this._connectTimeout.cancel();
					// Clear message buffers.
					this._msg_queue = [];
					this._notify_msg_sent = {};

					if (this.socket) {
						// Cancel all socket callbacks so that they cannot be driven again by this socket.
						this.socket.onopen = null;
						this.socket.onmessage = null;
						this.socket.onerror = null;
						this.socket.onclose = null;
						if (this.socket.readyState === 1) this.socket.close();
						delete this.socket;
					}

					if (this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1) {
						// Try the next host.
						this.hostIndex++;
						this._doConnect(this.connectOptions.uris[this.hostIndex]);
					} else {

						if (errorCode === undefined) {
							errorCode = ERROR.OK.code;
							errorText = format(ERROR.OK);
						}

						// Run any application callbacks last as they may attempt to reconnect and hence create a new socket.
						if (this.connected) {
							this.connected = false;
							// Execute the connectionLostCallback if there is one, and we were connected.      
							if (this.onConnectionLost) this.onConnectionLost({ errorCode: errorCode, errorMessage: errorText });
						} else {
							// Otherwise we never had a connection, so indicate that the connect has failed.
							if (this.connectOptions.mqttVersion === 4 && this.connectOptions.mqttVersionExplicit === false) {
								this._trace("Failed to connect V4, dropping back to V3");
								this.connectOptions.mqttVersion = 3;
								if (this.connectOptions.uris) {
									this.hostIndex = 0;
									this._doConnect(this.connectOptions.uris[0]);
								} else {
									this._doConnect(this.uri);
								}
							} else if (this.connectOptions.onFailure) {
								this.connectOptions.onFailure({ invocationContext: this.connectOptions.invocationContext, errorCode: errorCode, errorMessage: errorText });
							}
						}
					}
				};

				/** @ignore */
				ClientImpl.prototype._trace = function () {
					// Pass trace message back to client's callback function
					if (this.traceFunction) {
						for (var i in arguments) {
							if (typeof arguments[i] !== "undefined") arguments[i] = JSON.stringify(arguments[i]);
						}
						var record = Array.prototype.slice.call(arguments).join("");
						this.traceFunction({ severity: "Debug", message: record });
					}

					//buffer style trace
					if (this._traceBuffer !== null) {
						for (var i = 0, max = arguments.length; i < max; i++) {
							if (this._traceBuffer.length == this._MAX_TRACE_ENTRIES) {
								this._traceBuffer.shift();
							}
							if (i === 0) this._traceBuffer.push(arguments[i]);else if (typeof arguments[i] === "undefined") this._traceBuffer.push(arguments[i]);else this._traceBuffer.push("  " + JSON.stringify(arguments[i]));
						};
					};
				};

				/** @ignore */
				ClientImpl.prototype._traceMask = function (traceObject, masked) {
					var traceObjectMasked = {};
					for (var attr in traceObject) {
						if (traceObject.hasOwnProperty(attr)) {
							if (attr == masked) traceObjectMasked[attr] = "******";else traceObjectMasked[attr] = traceObject[attr];
						}
					}
					return traceObjectMasked;
				};

				// ------------------------------------------------------------------------
				// Public Programming interface.
				// ------------------------------------------------------------------------

				/** 
     * The JavaScript application communicates to the server using a {@link Paho.MQTT.Client} object. 
     * <p>
     * Most applications will create just one Client object and then call its connect() method,
     * however applications can create more than one Client object if they wish. 
     * In this case the combination of host, port and clientId attributes must be different for each Client object.
     * <p>
     * The send, subscribe and unsubscribe methods are implemented as asynchronous JavaScript methods 
     * (even though the underlying protocol exchange might be synchronous in nature). 
     * This means they signal their completion by calling back to the application, 
     * via Success or Failure callback functions provided by the application on the method in question. 
     * Such callbacks are called at most once per method invocation and do not persist beyond the lifetime 
     * of the script that made the invocation.
     * <p>
     * In contrast there are some callback functions, most notably <i>onMessageArrived</i>, 
     * that are defined on the {@link Paho.MQTT.Client} object.  
     * These may get called multiple times, and aren't directly related to specific method invocations made by the client. 
     *
     * @name Paho.MQTT.Client    
     * 
     * @constructor
     *  
     * @param {string} host - the address of the messaging server, as a fully qualified WebSocket URI, as a DNS name or dotted decimal IP address.
     * @param {number} port - the port number to connect to - only required if host is not a URI
     * @param {string} path - the path on the host to connect to - only used if host is not a URI. Default: '/mqtt'.
     * @param {string} clientId - the Messaging client identifier, between 1 and 23 characters in length.
     * 
     * @property {string} host - <i>read only</i> the server's DNS hostname or dotted decimal IP address.
     * @property {number} port - <i>read only</i> the server's port.
     * @property {string} path - <i>read only</i> the server's path.
     * @property {string} clientId - <i>read only</i> used when connecting to the server.
     * @property {function} onConnectionLost - called when a connection has been lost. 
     *                            after a connect() method has succeeded.
     *                            Establish the call back used when a connection has been lost. The connection may be
     *                            lost because the client initiates a disconnect or because the server or network 
     *                            cause the client to be disconnected. The disconnect call back may be called without 
     *                            the connectionComplete call back being invoked if, for example the client fails to 
     *                            connect.
     *                            A single response object parameter is passed to the onConnectionLost callback containing the following fields:
     *                            <ol>   
     *                            <li>errorCode
     *                            <li>errorMessage       
     *                            </ol>
     * @property {function} onMessageDelivered called when a message has been delivered. 
     *                            All processing that this Client will ever do has been completed. So, for example,
     *                            in the case of a Qos=2 message sent by this client, the PubComp flow has been received from the server
     *                            and the message has been removed from persistent storage before this callback is invoked. 
     *                            Parameters passed to the onMessageDelivered callback are:
     *                            <ol>   
     *                            <li>{@link Paho.MQTT.Message} that was delivered.
     *                            </ol>    
     * @property {function} onMessageArrived called when a message has arrived in this Paho.MQTT.client. 
     *                            Parameters passed to the onMessageArrived callback are:
     *                            <ol>   
     *                            <li>{@link Paho.MQTT.Message} that has arrived.
     *                            </ol>    
     */
				var Client = function Client(host, port, path, clientId) {

					var uri;

					if (typeof host !== "string") throw new Error(format(ERROR.INVALID_TYPE, [typeof host, "host"]));

					if (arguments.length == 2) {
						// host: must be full ws:// uri
						// port: clientId
						clientId = port;
						uri = host;
						var match = uri.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
						if (match) {
							host = match[4] || match[2];
							port = parseInt(match[7]);
							path = match[8];
						} else {
							throw new Error(format(ERROR.INVALID_ARGUMENT, [host, "host"]));
						}
					} else {
						if (arguments.length == 3) {
							clientId = path;
							path = "/mqtt";
						}
						if (typeof port !== "number" || port < 0) throw new Error(format(ERROR.INVALID_TYPE, [typeof port, "port"]));
						if (typeof path !== "string") throw new Error(format(ERROR.INVALID_TYPE, [typeof path, "path"]));

						var ipv6AddSBracket = host.indexOf(":") != -1 && host.slice(0, 1) != "[" && host.slice(-1) != "]";
						uri = "ws://" + (ipv6AddSBracket ? "[" + host + "]" : host) + ":" + port + path;
					}

					var clientIdLength = 0;
					for (var i = 0; i < clientId.length; i++) {
						var charCode = clientId.charCodeAt(i);
						if (55296 <= charCode && charCode <= 56319) {
							i++; // Surrogate pair.
						}
						clientIdLength++;
					}
					if (typeof clientId !== "string" || clientIdLength > 65535) throw new Error(format(ERROR.INVALID_ARGUMENT, [clientId, "clientId"]));

					var client = new ClientImpl(uri, host, port, path, clientId);
					this._getHost = function () {
						return host;
					};
					this._setHost = function () {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					};

					this._getPort = function () {
						return port;
					};
					this._setPort = function () {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					};

					this._getPath = function () {
						return path;
					};
					this._setPath = function () {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					};

					this._getURI = function () {
						return uri;
					};
					this._setURI = function () {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					};

					this._getClientId = function () {
						return client.clientId;
					};
					this._setClientId = function () {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					};

					this._getOnConnectionLost = function () {
						return client.onConnectionLost;
					};
					this._setOnConnectionLost = function (newOnConnectionLost) {
						if (typeof newOnConnectionLost === "function") client.onConnectionLost = newOnConnectionLost;else throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnectionLost, "onConnectionLost"]));
					};

					this._getOnMessageDelivered = function () {
						return client.onMessageDelivered;
					};
					this._setOnMessageDelivered = function (newOnMessageDelivered) {
						if (typeof newOnMessageDelivered === "function") client.onMessageDelivered = newOnMessageDelivered;else throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageDelivered, "onMessageDelivered"]));
					};

					this._getOnMessageArrived = function () {
						return client.onMessageArrived;
					};
					this._setOnMessageArrived = function (newOnMessageArrived) {
						if (typeof newOnMessageArrived === "function") client.onMessageArrived = newOnMessageArrived;else throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageArrived, "onMessageArrived"]));
					};

					this._getTrace = function () {
						return client.traceFunction;
					};
					this._setTrace = function (trace) {
						if (typeof trace === "function") {
							client.traceFunction = trace;
						} else {
							throw new Error(format(ERROR.INVALID_TYPE, [typeof trace, "onTrace"]));
						}
					};

					/** 
      * Connect this Messaging client to its server. 
      * 
      * @name Paho.MQTT.Client#connect
      * @function
      * @param {Object} connectOptions - attributes used with the connection. 
      * @param {number} connectOptions.timeout - If the connect has not succeeded within this 
      *                    number of seconds, it is deemed to have failed.
      *                    The default is 30 seconds.
      * @param {string} connectOptions.userName - Authentication username for this connection.
      * @param {string} connectOptions.password - Authentication password for this connection.
      * @param {Paho.MQTT.Message} connectOptions.willMessage - sent by the server when the client
      *                    disconnects abnormally.
      * @param {Number} connectOptions.keepAliveInterval - the server disconnects this client if
      *                    there is no activity for this number of seconds.
      *                    The default value of 60 seconds is assumed if not set.
      * @param {boolean} connectOptions.cleanSession - if true(default) the client and server 
      *                    persistent state is deleted on successful connect.
      * @param {boolean} connectOptions.useSSL - if present and true, use an SSL Websocket connection.
      * @param {object} connectOptions.invocationContext - passed to the onSuccess callback or onFailure callback.
      * @param {function} connectOptions.onSuccess - called when the connect acknowledgement 
      *                    has been received from the server.
      * A single response object parameter is passed to the onSuccess callback containing the following fields:
      * <ol>
      * <li>invocationContext as passed in to the onSuccess method in the connectOptions.       
      * </ol>
      * @config {function} [onFailure] called when the connect request has failed or timed out.
      * A single response object parameter is passed to the onFailure callback containing the following fields:
      * <ol>
      * <li>invocationContext as passed in to the onFailure method in the connectOptions.       
      * <li>errorCode a number indicating the nature of the error.
      * <li>errorMessage text describing the error.      
      * </ol>
      * @config {Array} [hosts] If present this contains either a set of hostnames or fully qualified
      * WebSocket URIs (ws://example.com:1883/mqtt), that are tried in order in place 
      * of the host and port paramater on the construtor. The hosts are tried one at at time in order until
      * one of then succeeds.
      * @config {Array} [ports] If present the set of ports matching the hosts. If hosts contains URIs, this property
      * is not used.
      * @throws {InvalidState} if the client is not in disconnected state. The client must have received connectionLost
      * or disconnected before calling connect for a second or subsequent time.
      */
					this.connect = function (connectOptions) {
						connectOptions = connectOptions || {};
						validate(connectOptions, { timeout: "number",
							userName: "string",
							password: "string",
							willMessage: "object",
							keepAliveInterval: "number",
							cleanSession: "boolean",
							useSSL: "boolean",
							invocationContext: "object",
							onSuccess: "function",
							onFailure: "function",
							hosts: "object",
							ports: "object",
							mqttVersion: "number" });

						// If no keep alive interval is set, assume 60 seconds.
						if (connectOptions.keepAliveInterval === undefined) connectOptions.keepAliveInterval = 60;

						if (connectOptions.mqttVersion > 4 || connectOptions.mqttVersion < 3) {
							throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.mqttVersion, "connectOptions.mqttVersion"]));
						}

						if (connectOptions.mqttVersion === undefined) {
							connectOptions.mqttVersionExplicit = false;
							connectOptions.mqttVersion = 4;
						} else {
							connectOptions.mqttVersionExplicit = true;
						}

						//Check that if password is set, so is username
						if (connectOptions.password === undefined && connectOptions.userName !== undefined) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.password, "connectOptions.password"]));

						if (connectOptions.willMessage) {
							if (!(connectOptions.willMessage instanceof Message)) throw new Error(format(ERROR.INVALID_TYPE, [connectOptions.willMessage, "connectOptions.willMessage"]));
							// The will message must have a payload that can be represented as a string.
							// Cause the willMessage to throw an exception if this is not the case.
							connectOptions.willMessage.stringPayload;

							if (typeof connectOptions.willMessage.destinationName === "undefined") throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.willMessage.destinationName, "connectOptions.willMessage.destinationName"]));
						}
						if (typeof connectOptions.cleanSession === "undefined") connectOptions.cleanSession = true;
						if (connectOptions.hosts) {

							if (!(connectOptions.hosts instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
							if (connectOptions.hosts.length < 1) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));

							var usingURIs = false;
							for (var i = 0; i < connectOptions.hosts.length; i++) {
								if (typeof connectOptions.hosts[i] !== "string") throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.hosts[i], "connectOptions.hosts[" + i + "]"]));
								if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(connectOptions.hosts[i])) {
									if (i == 0) {
										usingURIs = true;
									} else if (!usingURIs) {
										throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts[" + i + "]"]));
									}
								} else if (usingURIs) {
									throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts[" + i + "]"]));
								}
							}

							if (!usingURIs) {
								if (!connectOptions.ports) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
								if (!(connectOptions.ports instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
								if (connectOptions.hosts.length != connectOptions.ports.length) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));

								connectOptions.uris = [];

								for (var i = 0; i < connectOptions.hosts.length; i++) {
									if (typeof connectOptions.ports[i] !== "number" || connectOptions.ports[i] < 0) throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.ports[i], "connectOptions.ports[" + i + "]"]));
									var host = connectOptions.hosts[i];
									var port = connectOptions.ports[i];

									var ipv6 = host.indexOf(":") != -1;
									uri = "ws://" + (ipv6 ? "[" + host + "]" : host) + ":" + port + path;
									connectOptions.uris.push(uri);
								}
							} else {
								connectOptions.uris = connectOptions.hosts;
							}
						}

						client.connect(connectOptions);
					};

					/** 
      * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
      * 
      * @name Paho.MQTT.Client#subscribe
      * @function
      * @param {string} filter describing the destinations to receive messages from.
      * <br>
      * @param {object} subscribeOptions - used to control the subscription
      *
      * @param {number} subscribeOptions.qos - the maiximum qos of any publications sent 
      *                                  as a result of making this subscription.
      * @param {object} subscribeOptions.invocationContext - passed to the onSuccess callback 
      *                                  or onFailure callback.
      * @param {function} subscribeOptions.onSuccess - called when the subscribe acknowledgement
      *                                  has been received from the server.
      *                                  A single response object parameter is passed to the onSuccess callback containing the following fields:
      *                                  <ol>
      *                                  <li>invocationContext if set in the subscribeOptions.       
      *                                  </ol>
      * @param {function} subscribeOptions.onFailure - called when the subscribe request has failed or timed out.
      *                                  A single response object parameter is passed to the onFailure callback containing the following fields:
      *                                  <ol>
      *                                  <li>invocationContext - if set in the subscribeOptions.       
      *                                  <li>errorCode - a number indicating the nature of the error.
      *                                  <li>errorMessage - text describing the error.      
      *                                  </ol>
      * @param {number} subscribeOptions.timeout - which, if present, determines the number of
      *                                  seconds after which the onFailure calback is called.
      *                                  The presence of a timeout does not prevent the onSuccess
      *                                  callback from being called when the subscribe completes.         
      * @throws {InvalidState} if the client is not in connected state.
      */
					this.subscribe = function (filter, subscribeOptions) {
						if (typeof filter !== "string") throw new Error("Invalid argument:" + filter);
						subscribeOptions = subscribeOptions || {};
						validate(subscribeOptions, { qos: "number",
							invocationContext: "object",
							onSuccess: "function",
							onFailure: "function",
							timeout: "number"
						});
						if (subscribeOptions.timeout && !subscribeOptions.onFailure) throw new Error("subscribeOptions.timeout specified with no onFailure callback.");
						if (typeof subscribeOptions.qos !== "undefined" && !(subscribeOptions.qos === 0 || subscribeOptions.qos === 1 || subscribeOptions.qos === 2)) throw new Error(format(ERROR.INVALID_ARGUMENT, [subscribeOptions.qos, "subscribeOptions.qos"]));
						client.subscribe(filter, subscribeOptions);
					};

					/**
      * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
      * 
      * @name Paho.MQTT.Client#unsubscribe
      * @function
      * @param {string} filter - describing the destinations to receive messages from.
      * @param {object} unsubscribeOptions - used to control the subscription
      * @param {object} unsubscribeOptions.invocationContext - passed to the onSuccess callback 
                                           or onFailure callback.
      * @param {function} unsubscribeOptions.onSuccess - called when the unsubscribe acknowledgement has been received from the server.
      *                                    A single response object parameter is passed to the 
      *                                    onSuccess callback containing the following fields:
      *                                    <ol>
      *                                    <li>invocationContext - if set in the unsubscribeOptions.     
      *                                    </ol>
      * @param {function} unsubscribeOptions.onFailure called when the unsubscribe request has failed or timed out.
      *                                    A single response object parameter is passed to the onFailure callback containing the following fields:
      *                                    <ol>
      *                                    <li>invocationContext - if set in the unsubscribeOptions.       
      *                                    <li>errorCode - a number indicating the nature of the error.
      *                                    <li>errorMessage - text describing the error.      
      *                                    </ol>
      * @param {number} unsubscribeOptions.timeout - which, if present, determines the number of seconds
      *                                    after which the onFailure callback is called. The presence of
      *                                    a timeout does not prevent the onSuccess callback from being
      *                                    called when the unsubscribe completes
      * @throws {InvalidState} if the client is not in connected state.
      */
					this.unsubscribe = function (filter, unsubscribeOptions) {
						if (typeof filter !== "string") throw new Error("Invalid argument:" + filter);
						unsubscribeOptions = unsubscribeOptions || {};
						validate(unsubscribeOptions, { invocationContext: "object",
							onSuccess: "function",
							onFailure: "function",
							timeout: "number"
						});
						if (unsubscribeOptions.timeout && !unsubscribeOptions.onFailure) throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");
						client.unsubscribe(filter, unsubscribeOptions);
					};

					/**
      * Send a message to the consumers of the destination in the Message.
      * 
      * @name Paho.MQTT.Client#send
      * @function 
      * @param {string|Paho.MQTT.Message} topic - <b>mandatory</b> The name of the destination to which the message is to be sent. 
      * 					   - If it is the only parameter, used as Paho.MQTT.Message object.
      * @param {String|ArrayBuffer} payload - The message data to be sent. 
      * @param {number} qos The Quality of Service used to deliver the message.
      * 		<dl>
      * 			<dt>0 Best effort (default).
      *     			<dt>1 At least once.
      *     			<dt>2 Exactly once.     
      * 		</dl>
      * @param {Boolean} retained If true, the message is to be retained by the server and delivered 
      *                     to both current and future subscriptions.
      *                     If false the server only delivers the message to current subscribers, this is the default for new Messages. 
      *                     A received message has the retained boolean set to true if the message was published 
      *                     with the retained boolean set to true
      *                     and the subscrption was made after the message has been published. 
      * @throws {InvalidState} if the client is not connected.
      */
					this.send = function (topic, payload, qos, retained) {
						var message;

						if (arguments.length == 0) {
							throw new Error("Invalid argument." + "length");
						} else if (arguments.length == 1) {

							if (!(topic instanceof Message) && typeof topic !== "string") throw new Error("Invalid argument:" + typeof topic);

							message = topic;
							if (typeof message.destinationName === "undefined") throw new Error(format(ERROR.INVALID_ARGUMENT, [message.destinationName, "Message.destinationName"]));
							client.send(message);
						} else {
							//parameter checking in Message object
							message = new Message(payload);
							message.destinationName = topic;
							if (arguments.length >= 3) message.qos = qos;
							if (arguments.length >= 4) message.retained = retained;
							client.send(message);
						}
					};

					/** 
      * Normal disconnect of this Messaging client from its server.
      * 
      * @name Paho.MQTT.Client#disconnect
      * @function
      * @throws {InvalidState} if the client is already disconnected.     
      */
					this.disconnect = function () {
						client.disconnect();
					};

					/** 
      * Get the contents of the trace log.
      * 
      * @name Paho.MQTT.Client#getTraceLog
      * @function
      * @return {Object[]} tracebuffer containing the time ordered trace records.
      */
					this.getTraceLog = function () {
						return client.getTraceLog();
					};

					/** 
      * Start tracing.
      * 
      * @name Paho.MQTT.Client#startTrace
      * @function
      */
					this.startTrace = function () {
						client.startTrace();
					};

					/** 
      * Stop tracing.
      * 
      * @name Paho.MQTT.Client#stopTrace
      * @function
      */
					this.stopTrace = function () {
						client.stopTrace();
					};

					this.isConnected = function () {
						return client.connected;
					};
				};

				Client.prototype = Object.defineProperties({}, {
					host: {
						get: function () {
							return this._getHost();
						},
						set: function (newHost) {
							this._setHost(newHost);
						},
						configurable: true,
						enumerable: true
					},
					port: {
						get: function () {
							return this._getPort();
						},
						set: function (newPort) {
							this._setPort(newPort);
						},
						configurable: true,
						enumerable: true
					},
					path: {
						get: function () {
							return this._getPath();
						},
						set: function (newPath) {
							this._setPath(newPath);
						},
						configurable: true,
						enumerable: true
					},
					clientId: {
						get: function () {
							return this._getClientId();
						},
						set: function (newClientId) {
							this._setClientId(newClientId);
						},
						configurable: true,
						enumerable: true
					},
					onConnectionLost: {
						get: function () {
							return this._getOnConnectionLost();
						},
						set: function (newOnConnectionLost) {
							this._setOnConnectionLost(newOnConnectionLost);
						},
						configurable: true,
						enumerable: true
					},
					onMessageDelivered: {
						get: function () {
							return this._getOnMessageDelivered();
						},
						set: function (newOnMessageDelivered) {
							this._setOnMessageDelivered(newOnMessageDelivered);
						},
						configurable: true,
						enumerable: true
					},
					onMessageArrived: {
						get: function () {
							return this._getOnMessageArrived();
						},
						set: function (newOnMessageArrived) {
							this._setOnMessageArrived(newOnMessageArrived);
						},
						configurable: true,
						enumerable: true
					},
					trace: {
						get: function () {
							return this._getTrace();
						},
						set: function (newTraceFunction) {
							this._setTrace(newTraceFunction);
						},
						configurable: true,
						enumerable: true
					}
				});

				/** 
     * An application message, sent or received.
     * <p>
     * All attributes may be null, which implies the default values.
     * 
     * @name Paho.MQTT.Message
     * @constructor
     * @param {String|ArrayBuffer} payload The message data to be sent.
     * <p>
     * @property {string} payloadString <i>read only</i> The payload as a string if the payload consists of valid UTF-8 characters.
     * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an ArrayBuffer.
     * <p>
     * @property {string} destinationName <b>mandatory</b> The name of the destination to which the message is to be sent
     *                    (for messages about to be sent) or the name of the destination from which the message has been received.
     *                    (for messages received by the onMessage function).
     * <p>
     * @property {number} qos The Quality of Service used to deliver the message.
     * <dl>
     *     <dt>0 Best effort (default).
     *     <dt>1 At least once.
     *     <dt>2 Exactly once.     
     * </dl>
     * <p>
     * @property {Boolean} retained If true, the message is to be retained by the server and delivered 
     *                     to both current and future subscriptions.
     *                     If false the server only delivers the message to current subscribers, this is the default for new Messages. 
     *                     A received message has the retained boolean set to true if the message was published 
     *                     with the retained boolean set to true
     *                     and the subscrption was made after the message has been published. 
     * <p>
     * @property {Boolean} duplicate <i>read only</i> If true, this message might be a duplicate of one which has already been received. 
     *                     This is only set on messages received from the server.
     *                     
     */
				var Message = function Message(newPayload) {
					var payload;
					if (typeof newPayload === "string" || newPayload instanceof ArrayBuffer || newPayload instanceof Int8Array || newPayload instanceof Uint8Array || newPayload instanceof Int16Array || newPayload instanceof Uint16Array || newPayload instanceof Int32Array || newPayload instanceof Uint32Array || newPayload instanceof Float32Array || newPayload instanceof Float64Array) {
						payload = newPayload;
					} else {
						throw format(ERROR.INVALID_ARGUMENT, [newPayload, "newPayload"]);
					}

					this._getPayloadString = function () {
						if (typeof payload === "string") return payload;else return parseUTF8(payload, 0, payload.length);
					};

					this._getPayloadBytes = function () {
						if (typeof payload === "string") {
							var buffer = new ArrayBuffer(UTF8Length(payload));
							var byteStream = new Uint8Array(buffer);
							stringToUTF8(payload, byteStream, 0);

							return byteStream;
						} else {
							return payload;
						};
					};

					var destinationName = undefined;
					this._getDestinationName = function () {
						return destinationName;
					};
					this._setDestinationName = function (newDestinationName) {
						if (typeof newDestinationName === "string") destinationName = newDestinationName;else throw new Error(format(ERROR.INVALID_ARGUMENT, [newDestinationName, "newDestinationName"]));
					};

					var qos = 0;
					this._getQos = function () {
						return qos;
					};
					this._setQos = function (newQos) {
						if (newQos === 0 || newQos === 1 || newQos === 2) qos = newQos;else throw new Error("Invalid argument:" + newQos);
					};

					var retained = false;
					this._getRetained = function () {
						return retained;
					};
					this._setRetained = function (newRetained) {
						if (typeof newRetained === "boolean") retained = newRetained;else throw new Error(format(ERROR.INVALID_ARGUMENT, [newRetained, "newRetained"]));
					};

					var duplicate = false;
					this._getDuplicate = function () {
						return duplicate;
					};
					this._setDuplicate = function (newDuplicate) {
						duplicate = newDuplicate;
					};
				};

				Message.prototype = Object.defineProperties({}, {
					payloadString: {
						get: function () {
							return this._getPayloadString();
						},
						configurable: true,
						enumerable: true
					},
					payloadBytes: {
						get: function () {
							return this._getPayloadBytes();
						},
						configurable: true,
						enumerable: true
					},
					destinationName: {
						get: function () {
							return this._getDestinationName();
						},
						set: function (newDestinationName) {
							this._setDestinationName(newDestinationName);
						},
						configurable: true,
						enumerable: true
					},
					qos: {
						get: function () {
							return this._getQos();
						},
						set: function (newQos) {
							this._setQos(newQos);
						},
						configurable: true,
						enumerable: true
					},
					retained: {
						get: function () {
							return this._getRetained();
						},
						set: function (newRetained) {
							this._setRetained(newRetained);
						},
						configurable: true,
						enumerable: true
					},
					duplicate: {
						get: function () {
							return this._getDuplicate();
						},
						set: function (newDuplicate) {
							this._setDuplicate(newDuplicate);
						},
						configurable: true,
						enumerable: true
					}
				});

				// Module contents.
				return {
					Client: Client,
					Message: Message
				};
			})(window);

			_export("default", Paho);
		}
	};
});
//# sourceMappingURL=data:application/json;base64,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QUFNLElBQUcsRUFBRSxDQUFBLElBQUssV0FBVyxHQUFHLEtBQU0sQ0FBQSxBQUFDLEdBQUcsS0FBTyxDQUFDO09BRXhFOztBQUVELFVBQUksUUFBUSxJQUFJLEdBQUksRUFBRTtBQUNyQixhQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7T0FDekIsTUFBTSxJQUFJLFFBQVEsSUFBSSxJQUFLLEVBQUU7QUFDN0IsYUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsUUFBUSxJQUFFLENBQUMsR0FBSSxFQUFJLEdBQUcsR0FBSSxDQUFDO0FBQzNDLGFBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFFBQVEsR0FBTyxFQUFJLEdBQUcsR0FBSSxDQUFDO09BQzNDLE1BQU0sSUFBSSxRQUFRLElBQUksS0FBTSxFQUFFO0FBQzlCLGFBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFFBQVEsSUFBRSxFQUFFLEdBQUcsRUFBSSxHQUFHLEdBQUksQ0FBQztBQUMzQyxhQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxRQUFRLElBQUUsQ0FBQyxHQUFJLEVBQUksR0FBRyxHQUFJLENBQUM7QUFDM0MsYUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsUUFBUSxHQUFPLEVBQUksR0FBRyxHQUFJLENBQUM7T0FDM0MsTUFBTTtBQUNOLGFBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFFBQVEsSUFBRSxFQUFFLEdBQUcsQ0FBSSxHQUFHLEdBQUksQ0FBQztBQUMzQyxhQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxRQUFRLElBQUUsRUFBRSxHQUFHLEVBQUksR0FBRyxHQUFJLENBQUM7QUFDM0MsYUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsUUFBUSxJQUFFLENBQUMsR0FBSSxFQUFJLEdBQUcsR0FBSSxDQUFDO0FBQzNDLGFBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFFBQVEsR0FBTyxFQUFJLEdBQUcsR0FBSSxDQUFDO09BQzNDLENBQUM7TUFDRjtB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