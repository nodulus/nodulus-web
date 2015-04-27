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