System.register([], function (_export) {
	var window, Paho;
	return {
		setters: [],
		execute: function () {
			"use strict";

			window = global;
			Paho = {};

			Paho.MQTT = (function (global) {

				var version = "@VERSION@";
				var buildLevel = "@BUILDLEVEL@";

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

				var scope = (function (_scope) {
					function scope(_x, _x2) {
						return _scope.apply(this, arguments);
					}

					scope.toString = function () {
						return _scope.toString();
					};

					return scope;
				})(function (f, scope) {
					return function () {
						return f.apply(scope, arguments);
					};
				});

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

				var CONNACK_RC = {
					0: "Connection Accepted",
					1: "Connection Refused: unacceptable protocol version",
					2: "Connection Refused: identifier rejected",
					3: "Connection Refused: server unavailable",
					4: "Connection Refused: bad user name or password",
					5: "Connection Refused: not authorized"
				};

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

				var MqttProtoIdentifierv3 = [0, 6, 77, 81, 73, 115, 100, 112, 3];

				var MqttProtoIdentifierv4 = [0, 4, 77, 81, 84, 84, 4];

				var WireMessage = function WireMessage(type, options) {
					this.type = type;
					for (var name in options) {
						if (options.hasOwnProperty(name)) {
							this[name] = options[name];
						}
					}
				};

				WireMessage.prototype.encode = function () {
					var first = (this.type & 15) << 4;

					var remLength = 0;
					var topicStrLength = new Array();
					var destinationNameLength = 0;

					if (this.messageIdentifier != undefined) remLength += 2;

					switch (this.type) {
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

								var willMessagePayloadBytes = this.willMessage.payloadBytes;
								if (!(willMessagePayloadBytes instanceof Uint8Array)) willMessagePayloadBytes = new Uint8Array(payloadBytes);
								remLength += willMessagePayloadBytes.byteLength + 2;
							}
							if (this.userName != undefined) remLength += UTF8Length(this.userName) + 2;
							if (this.password != undefined) remLength += UTF8Length(this.password) + 2;
							break;

						case MESSAGE_TYPE.SUBSCRIBE:
							first |= 2;
							for (var i = 0; i < this.topics.length; i++) {
								topicStrLength[i] = UTF8Length(this.topics[i]);
								remLength += topicStrLength[i] + 2;
							}
							remLength += this.requestedQos.length;
							break;

						case MESSAGE_TYPE.UNSUBSCRIBE:
							first |= 2;
							for (var i = 0; i < this.topics.length; i++) {
								topicStrLength[i] = UTF8Length(this.topics[i]);
								remLength += topicStrLength[i] + 2;
							}
							break;

						case MESSAGE_TYPE.PUBREL:
							first |= 2;
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

					var mbi = encodeMBI(remLength);
					var pos = mbi.length + 1;
					var buffer = new ArrayBuffer(remLength + pos);
					var byteStream = new Uint8Array(buffer);
					byteStream[0] = first;
					byteStream.set(mbi, 1);

					if (this.type == MESSAGE_TYPE.PUBLISH) pos = writeString(this.payloadMessage.destinationName, destinationNameLength, byteStream, pos);else if (this.type == MESSAGE_TYPE.CONNECT) {
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
							byteStream.set(payloadBytes, pos);

							break;

						case MESSAGE_TYPE.SUBSCRIBE:
							for (var i = 0; i < this.topics.length; i++) {
								pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
								byteStream[pos++] = this.requestedQos[i];
							}
							break;

						case MESSAGE_TYPE.UNSUBSCRIBE:
							for (var i = 0; i < this.topics.length; i++) pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
							break;

						default:
					}

					return buffer;
				};

				function decodeMessage(input, pos) {
					var startingPos = pos;
					var first = input[pos];
					var type = first >> 4;
					var messageInfo = first &= 15;
					pos += 1;

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
					buffer[offset++] = input >> 8;
					buffer[offset++] = input % 256;
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

				function UTF8Length(input) {
					var output = 0;
					for (var i = 0; i < input.length; i++) {
						var charCode = input.charCodeAt(i);
						if (charCode > 2047) {
							if (55296 <= charCode && charCode <= 56319) {
								i++;
								output++;
							}
							output += 3;
						} else if (charCode > 127) output += 2;else output++;
					}
					return output;
				}

				function stringToUTF8(input, output, start) {
					var pos = start;
					for (var i = 0; i < input.length; i++) {
						var charCode = input.charCodeAt(i);

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
							if (byte1 < 224) utf16 = 64 * (byte1 - 192) + byte2;else {
								var byte3 = input[pos++] - 128;
								if (byte3 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16)]));
								if (byte1 < 240) utf16 = 4096 * (byte1 - 224) + 64 * byte2 + byte3;else {
									var byte4 = input[pos++] - 128;
									if (byte4 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
									if (byte1 < 248) utf16 = 262144 * (byte1 - 240) + 4096 * byte2 + 64 * byte3 + byte4;else throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
								}
							}
						}

						if (utf16 > 65535) {
								utf16 -= 65536;
								output += String.fromCharCode(55296 + (utf16 >> 10));
								utf16 = 56320 + (utf16 & 1023);
							}
						output += String.fromCharCode(utf16);
					}
					return output;
				}

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

				var ClientImpl = function ClientImpl(uri, host, port, path, clientId) {
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

					this._localKey = host + ":" + port + (path != "/mqtt" ? ":" + path : "") + ":" + clientId + ":";

					this._msg_queue = [];

					this._sentMessages = {};

					this._receivedMessages = {};

					this._notify_msg_sent = {};

					this._message_identifier = 1;

					this._sequence = 0;

					for (var key in localStorage) if (key.indexOf("Sent:" + this._localKey) == 0 || key.indexOf("Received:" + this._localKey) == 0) this.restore(key);
				};

				ClientImpl.prototype.host;
				ClientImpl.prototype.port;
				ClientImpl.prototype.path;
				ClientImpl.prototype.uri;
				ClientImpl.prototype.clientId;

				ClientImpl.prototype.socket;

				ClientImpl.prototype.connected = false;

				ClientImpl.prototype.maxMessageIdentifier = 65536;
				ClientImpl.prototype.connectOptions;
				ClientImpl.prototype.hostIndex;
				ClientImpl.prototype.onConnectionLost;
				ClientImpl.prototype.onMessageDelivered;
				ClientImpl.prototype.onMessageArrived;
				ClientImpl.prototype.traceFunction;
				ClientImpl.prototype._msg_queue = null;
				ClientImpl.prototype._connectTimeout;

				ClientImpl.prototype.sendPinger = null;

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

					this._requires_ack(wireMessage);
					this._schedule_message(wireMessage);
				};

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

				ClientImpl.prototype._schedule_message = function (message) {
					this._msg_queue.push(message);

					if (this.connected) {
						this._process_queue();
					}
				};

				ClientImpl.prototype.store = function (prefix, wireMessage) {
					var storedMessage = { type: wireMessage.type, messageIdentifier: wireMessage.messageIdentifier, version: 1 };

					switch (wireMessage.type) {
						case MESSAGE_TYPE.PUBLISH:
							if (wireMessage.pubRecReceived) storedMessage.pubRecReceived = true;

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

					var fifo = this._msg_queue.reverse();

					while (message = fifo.pop()) {
						this._socket_send(message);

						if (this._notify_msg_sent[message]) {
							this._notify_msg_sent[message]();
							delete this._notify_msg_sent[message];
						}
					}
				};

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

				ClientImpl.prototype._on_socket_open = function () {
					var wireMessage = new WireMessage(MESSAGE_TYPE.CONNECT, this.connectOptions);
					wireMessage.clientId = this.clientId;
					this._socket_send(wireMessage);
				};

				ClientImpl.prototype._on_socket_message = function (event) {
					this._trace("Client._on_socket_message", event.data);

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

								if (wireMessage.returnCode === 0) {
									this.connected = true;

									if (this.connectOptions.uris) this.hostIndex = this.connectOptions.uris.length;
								} else {
									this._disconnected(ERROR.CONNACK_RETURNCODE.code, format(ERROR.CONNACK_RETURNCODE, [wireMessage.returnCode, CONNACK_RC[wireMessage.returnCode]]));
									break;
								}

								var sequencedMessages = new Array();
								for (var msgId in this._sentMessages) {
									if (this._sentMessages.hasOwnProperty(msgId)) sequencedMessages.push(this._sentMessages[msgId]);
								}

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

								if (this.connectOptions.onSuccess) {
									this.connectOptions.onSuccess({ invocationContext: this.connectOptions.invocationContext });
								}

								this._process_queue();
								break;

							case MESSAGE_TYPE.PUBLISH:
								this._receivePublish(wireMessage);
								break;

							case MESSAGE_TYPE.PUBACK:
								var sentMessage = this._sentMessages[wireMessage.messageIdentifier];

								if (sentMessage) {
									delete this._sentMessages[wireMessage.messageIdentifier];
									localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
									if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
								}
								break;

							case MESSAGE_TYPE.PUBREC:
								var sentMessage = this._sentMessages[wireMessage.messageIdentifier];

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

								if (receivedMessage) {
									this._receiveMessage(receivedMessage);
									delete this._receivedMessages[wireMessage.messageIdentifier];
								}

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
								this.sendPinger.reset();
								break;

							case MESSAGE_TYPE.DISCONNECT:
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

				ClientImpl.prototype._on_socket_error = function (error) {
					this._disconnected(ERROR.SOCKET_ERROR.code, format(ERROR.SOCKET_ERROR, [error.data]));
				};

				ClientImpl.prototype._on_socket_close = function () {
					this._disconnected(ERROR.SOCKET_CLOSE.code, format(ERROR.SOCKET_CLOSE));
				};

				ClientImpl.prototype._socket_send = function (wireMessage) {

					if (wireMessage.type == 1) {
						var wireMessageMasked = this._traceMask(wireMessage, "password");
						this._trace("Client._socket_send", wireMessageMasked);
					} else this._trace("Client._socket_send", wireMessage);

					this.socket.send(wireMessage.encode());

					this.sendPinger.reset();
				};

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

				ClientImpl.prototype._receiveMessage = function (wireMessage) {
					if (this.onMessageArrived) {
						this.onMessageArrived(wireMessage.payloadMessage);
					}
				};

				ClientImpl.prototype._disconnected = function (errorCode, errorText) {
					this._trace("Client._disconnected", errorCode, errorText);

					this.sendPinger.cancel();
					this.receivePinger.cancel();
					if (this._connectTimeout) this._connectTimeout.cancel();

					this._msg_queue = [];
					this._notify_msg_sent = {};

					if (this.socket) {
						this.socket.onopen = null;
						this.socket.onmessage = null;
						this.socket.onerror = null;
						this.socket.onclose = null;
						if (this.socket.readyState === 1) this.socket.close();
						delete this.socket;
					}

					if (this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1) {
						this.hostIndex++;
						this._doConnect(this.connectOptions.uris[this.hostIndex]);
					} else {

						if (errorCode === undefined) {
							errorCode = ERROR.OK.code;
							errorText = format(ERROR.OK);
						}

						if (this.connected) {
							this.connected = false;

							if (this.onConnectionLost) this.onConnectionLost({ errorCode: errorCode, errorMessage: errorText });
						} else {
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

				ClientImpl.prototype._trace = function () {
					if (this.traceFunction) {
						for (var i in arguments) {
							if (typeof arguments[i] !== "undefined") arguments[i] = JSON.stringify(arguments[i]);
						}
						var record = Array.prototype.slice.call(arguments).join("");
						this.traceFunction({ severity: "Debug", message: record });
					}

					if (this._traceBuffer !== null) {
						for (var i = 0, max = arguments.length; i < max; i++) {
							if (this._traceBuffer.length == this._MAX_TRACE_ENTRIES) {
								this._traceBuffer.shift();
							}
							if (i === 0) this._traceBuffer.push(arguments[i]);else if (typeof arguments[i] === "undefined") this._traceBuffer.push(arguments[i]);else this._traceBuffer.push("  " + JSON.stringify(arguments[i]));
						};
					};
				};

				ClientImpl.prototype._traceMask = function (traceObject, masked) {
					var traceObjectMasked = {};
					for (var attr in traceObject) {
						if (traceObject.hasOwnProperty(attr)) {
							if (attr == masked) traceObjectMasked[attr] = "******";else traceObjectMasked[attr] = traceObject[attr];
						}
					}
					return traceObjectMasked;
				};

				var Client = function Client(host, port, path, clientId) {

					var uri;

					if (typeof host !== "string") throw new Error(format(ERROR.INVALID_TYPE, [typeof host, "host"]));

					if (arguments.length == 2) {
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
							i++;
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

						if (connectOptions.password === undefined && connectOptions.userName !== undefined) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.password, "connectOptions.password"]));

						if (connectOptions.willMessage) {
							if (!(connectOptions.willMessage instanceof Message)) throw new Error(format(ERROR.INVALID_TYPE, [connectOptions.willMessage, "connectOptions.willMessage"]));

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
							message = new Message(payload);
							message.destinationName = topic;
							if (arguments.length >= 3) message.qos = qos;
							if (arguments.length >= 4) message.retained = retained;
							client.send(message);
						}
					};

					this.disconnect = function () {
						client.disconnect();
					};

					this.getTraceLog = function () {
						return client.getTraceLog();
					};

					this.startTrace = function () {
						client.startTrace();
					};

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

				return {
					Client: Client,
					Message: Message
				};
			})(window);

			_export("default", Paho);
		}
	};
});
//# sourceMappingURL=data:application/json;base64,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