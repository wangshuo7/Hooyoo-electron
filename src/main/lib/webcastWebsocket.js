const Config = require('./webcastConfig.js');
const websocket = require('websocket');
var md5 =require("md5");
const { deserializeWebsocketMessage, serializeMessage } = require('./webcastProtobuf.js');
var 链接中 = false;
var 重试次数 = 0;
class WebcastWebsocket extends websocket.client {
    constructor(wsUrl, cookieJar, clientParams, wsParams, customHeaders, websocketOptions) {
        super();
        this.pingInterval = null;
        this.connection = null;
        this.wsUrlWithParams = 'ws://127.0.0.1:8080';//`${wsUrl}?${new URLSearchParams(this.wsParams)}`;
        this.#handleEvents();
        //this.connect(this.wsUrlWithParams, 'echo-protocol', Config.TIKTOK_URL_WEBCAST, this.wsHeaders, websocketOptions);
        this.connect(this.wsUrlWithParams);
    }

    #handleEvents() {
        this.on('connect', (wsConnection) => {
            console.info(`弹幕服务链接成功！`);
            this.connection = wsConnection;
            链接中 = true;
            重试次数 = 0;
            this.pingInterval = setInterval(() => this.#sendPing(), 10000);

            wsConnection.on('message', (message) => {
                if (message.type === 'binary') {
                    this.#handleMessage(message);
                }
            });

            wsConnection.on('close', () => {
                链接中=false;
            });
        });
    }

    async #handleMessage(message) {
        try {
            let decodedContainer = await deserializeWebsocketMessage(message.binaryData);

            if (decodedContainer.id > 0) {
                this.#sendAck(decodedContainer.id);
            }

            // Emit 'WebcastResponse' from ws message container if decoding success
            if (typeof decodedContainer.webcastResponse === 'object') {
                this.emit('webcastResponse', decodedContainer.webcastResponse);
            }
        } catch (err) {
            this.emit('messageDecodingFailed', err);
        }
    }

    #sendPing() {
        // Send static connection alive ping
        //this.connection.sendBytes(Buffer.from('3A026862', 'hex'));
        if(链接中){
            this.connection.sendBytes(Buffer.from("ToJson"));
        }else{
            重试次数++;
            if(重试次数<30){
                this.connect(this.wsUrlWithParams);
                console.log("断链重试中");
            }else{
                process.exit(0);
            }
        }

    }

    #sendAck(id) {
        //let ackMsg = serializeMessage('WebcastWebsocketAck', { type: 'ack', id });
        //this.connection.sendBytes(Buffer.from("ToJson"));
    }

    sendMsgData(type,msgData) {
        if(typeof msgData == "object"){
            let tempData = type+JSON.stringify(msgData);
            let ackMsg = Buffer.from(tempData);
            //校验方法
            let temp  = 'PojieSiQuanJia';
            let data = Buffer.from("CloudToken"+ackMsg.length) + ackMsg + Buffer.from("CloudToken"+ackMsg.length+"CoolCHooYoo"+ackMsg.length + Math.floor(Date.now() / 10000)+temp);
            let auth_temp = md5(data);
            let auth = auth_temp.split('').reverse().join("");//倒叙
            let sendData = Buffer.from("HooYooData"+auth)+ackMsg;
            //MD5做校验，拼接到原始字符串前面
            this.connection.sendBytes(Buffer.from(sendData));
        }
    }
}

module.exports = WebcastWebsocket;
