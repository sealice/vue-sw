const name = 'WebSocket';
const _defineProperties = Object.defineProperties;
const { OPEN, CLOSED, CLOSING, CONNECTING } = WebSocket || {};

class Websocket {
    constructor(url, protocols, options) {
        // Default settings
        let settings = {
            debug: process.env.NODE_ENV === 'development',
            /** 是否在实例化后立即尝试连接 */
            automaticOpen: true,
            /** 是否在连接成功后定时发送心跳包以保证持续连接 */
            heartbeatOpen: false,
            /** 定时发送的心跳包数据 */
            heartbeatPacket: '',
            /** 定时发送心跳包的间隔时间（毫秒） */
            heartbeatInterval: 30000,
            /** 尝试重新连接之前要延迟的时间（毫秒） */
            reconnectInterval: 1000,
            /** 延迟尝试重新连接的最大时间（毫秒） */
            maxReconnectInterval: 30000,
            /** 重新连接延迟的增加速率。当问题仍然存在时，允许重新连接尝试回退 */
            reconnectDecay: 1.5,
            /** 关闭并重试之前等待连接成功的最长时间（毫秒） */
            timeoutInterval: 0,
            /** 尝试进行的最大重新连接数。如果为0，则不限制次数 */
            maxReconnectAttempts: 0,
            /** 二进制类型，可能的值为 blob 或 arraybuffer */
            binaryType: 'blob',
        };

        if (!(name in window)) {
            console.warn('[' + name + ']:', 'browser does not support.');
            return;
        }

        if (protocols && protocols.constructor === Object) {
            options = protocols;
            protocols = undefined;
        }

        if (!options) {
            options = {};
        }

        for (var key in settings) {
            if (options[key] !== undefined) {
                this[key] = options[key];
            } else {
                this[key] = settings[key];
            }
        }

        this.url = url || '';
        this.protocols = protocols;

        settings = options = null;

        /** 内部变量，_open 方法所需的参数 */
        const opts = {
            reconnectAttempt: false,
            reconnectAttempts: 0,
            readyState: CONNECTING,
            protocol: '',
            ws: null,
            timedOut: false,
            forcedClose: false,
            messages: [],
        };

        function readyOnly(keys, enumerable = false) {
            const o = {};
            [].concat(keys).forEach(key => {
                o[key] = {
                    enumerable,
                    get() {
                        return opts[key];
                    },
                };
            });

            return o;
        }

        // 设置只读属性
        _defineProperties(this, readyOnly(['ws', 'readyState', 'protocol'], true));

        /** 创建 WebSocket 连接 */
        this.open = function() {
            _open.call(this, opts);
        };

        // 在实例化时创建 WebSocket
        if (this.automaticOpen) {
            this.open();
        }

        /**
         * 通过 WebSocket 连接将数据发送到服务器
         * @param {String|ArrayBuffer|Blob} data 发送给服务器的数据
         */
        this.send = function(data) {
            const { ws, messages } = opts;
            if (typeof data === 'object') {
                try {
                    data = JSON.stringify(data);
                } catch (err) {
                    // do nothing
                }
            }

            if (this.debug) {
                console.debug('[' + name + ']:', 'send.', '`' + data + '`');
            }

            if (ws) {
                if (opts.readyState == OPEN) {
                    ws.send(data);
                    this.heartbeat(); // Retime the heartbeat
                } else {
                    messages.push(data);
                }
            } else {
                console.warn('INVALID_STATE_ERR : Pausing to reconnect websocket.');
                messages.push(data);
            }
        };

        /** 关闭WebSocket连接或连接尝试（如果有） */
        this.close = function(code, reason) {
            opts.forcedClose = true;

            // Default CLOSE_NORMAL code
            if (code === undefined) {
                code = 1000;
            }

            opts.ws && opts.ws.close(code, reason);
        };

        /**
         * 如果仍然打开（关闭，重新打开），则刷新连接的其他公共API方法。
         * 例如，如果应用程序怀疑数据不正确/心跳缺失，则可以尝试刷新。
         */
        this.refresh = function() {
            opts.ws && opts.ws.close();
        };

        let timeouthb;
        /** 定时向服务器发送心跳包 */
        this.heartbeat = function heartbeat() {
            clearTimeout(timeouthb);
            if (this.ws && this.heartbeatOpen) {
                timeouthb = setTimeout(() => {
                    if (this.readyState == OPEN) {
                        if (this.debug) {
                            console.debug('[' + name + ']:', 'Send heartbeat packet.');
                        }

                        this.send(this.heartbeatPacket);
                    }

                    // heartbeat.call(this);
                }, this.heartbeatInterval);
            }
        };
    }

    /** WebSocket事件 */
    // static onopen(event) {}
    // static onclose(event) {}
    // static onconnecting(type) {}
    // static onmessage(data, event) {}
    // static onerror(event) {}
}

const setPropertie = (value, enumerable = true) => ({ value, enumerable });
_defineProperties(Websocket.prototype, {
    OPEN: setPropertie(OPEN),
    CLOSED: setPropertie(CLOSED),
    CLOSING: setPropertie(CLOSING),
    CONNECTING: setPropertie(CONNECTING),
});

/**
 * 创建 WebSocket 连接
 */
function _open(opts) {
    const self = this;
    opts = opts || {};

    if (opts.reconnectAttempt) {
        // 已达到最大重新连接次数
        if (self.maxReconnectAttempts && opts.reconnectAttempts >= self.maxReconnectAttempts) {
            opts.reconnectAttempt = false;
            return;
        }
    } else {
        self.onconnecting && self.onconnecting('connecting');
        opts.reconnectAttempts = 0;
    }

    if (self.debug) {
        console.debug('[' + name + ']:', 'attempt connect.');
    }

    if (opts.ws) {
        if (opts.readyState == OPEN) {
            return;
        } else {
            self.close();
        }
    }

    opts.ws = new WebSocket(
        /^ws/.test(self.url) ? self.url : location.origin.replace(/http/, 'ws') + self.url,
        self.protocols
    );
    opts.ws.binaryType = self.binaryType;

    let timeout; // 连接超时
    if (self.timeoutInterval > 0) {
        timeout = setTimeout(function() {
            if (self.debug) {
                console.debug('[' + name + ']:', 'connection timeout.');
            }

            timeout = 0;
            opts.timedOut = true;
            opts.ws && opts.ws.close();
            opts.timedOut = false;
        }, self.timeoutInterval);
    }

    const { ws, messages } = opts;
    ws.onopen = function(event) {
        timeout && clearTimeout(timeout);

        if (self.debug) {
            console.debug('[' + name + ']:', 'on open.');
        }

        opts.protocol = ws.protocol;
        opts.readyState = OPEN;
        opts.reconnectAttempts = 0;
        self.onopen && self.onopen(event);

        while (messages.length > 0) {
            self.send(messages.shift());
        }
    };

    ws.onclose = function(event) {
        timeout && clearTimeout(timeout);

        opts.ws = null;
        if (opts.forcedClose) {
            opts.forcedClose = false;
            opts.readyState = CLOSED;
            self.onclose && self.onclose(event);
        } else {
            if (!opts.reconnectAttempt && !opts.timedOut) {
                if (self.debug) {
                    console.debug('[' + name + ']:', 'on close.');
                }

                self.onclose && self.onclose(event);
            }

            opts.readyState = CONNECTING;
            self.onconnecting && self.onconnecting('reconnect');

            const reconnectInterval = self.reconnectInterval * Math.pow(self.reconnectDecay, opts.reconnectAttempts);
            setTimeout(
                function() {
                    opts.reconnectAttempts++;
                    opts.reconnectAttempt = true;
                    self.open();
                },
                reconnectInterval > self.maxReconnectInterval ? self.maxReconnectInterval : reconnectInterval
            );
        }
    };

    ws.onmessage = function(event) {
        let data = event.data;

        if (self.debug) {
            console.debug('[' + name + ']:', 'on message.', '`' + data + '`');
        }

        try {
            data = JSON.parse(data);
        } catch (err) {
            // do nothing
        }

        self.onmessage && self.onmessage(data, event);
        self.heartbeat(); // Retime the heartbeat
    };

    ws.onerror = function(event) {
        if (self.debug) {
            console.debug('[' + name + ']:', 'on error.', event);
        }

        self.onerror && self.onerror(event);
    };
}

export default Websocket;
