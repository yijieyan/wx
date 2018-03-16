let {accessKey, secretKey, bucket} = require('../config/config');
let qiniu = require('qiniu');

function formatMessage(result) {

    let message = {};
    if (typeof result === 'object') {
        let keys = Object.keys(result);

        for (let i=0; i< keys.length; i++) {
            let item = result[keys[i]];
            let key = keys[i];

            if (!(item instanceof Array) || item.length === 0) {
                if (typeof item === 'object') {
                    message[key] = formatMessage(item);
                }else {
                    message[key] = (item || '').trim();
                }
                continue;
            }

            if (item.length === 1) {
                let val = item[0];

                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                }else {
                    message[key] = (val || '').trim();
                }
            }else {
                message[key] = [];

                for (let j= 0; j< item.length; j++) {
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }

    return message;
};

function generatorData (content, message) {
    let info = {};
    let type = 'text';
    let toUserName = message.ToUserName;
    let fromUserName = message.FromUserName;
    if (Array.isArray(content)) {
        type = 'news';
    }

    info.toUserName = fromUserName;
    info.fromUserName = toUserName;
    info.msgType = content.type ? content.type : type;
    info.createTime = Date.now();
    info.content = content;
    return info;
};


let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2; // todo 我是生成bucket选的华南
let bucketManager = new qiniu.rs.BucketManager(mac, config);
let uploadFile = function(url, key) {
    return new Promise((resolve, reject) => {
        bucketManager.fetch(url, bucket, key, function(err, respBody, respInfo) {
            if (err) {
                reject(err);
            }else {
                if (respInfo.statusCode == 200) {
                    resolve({key: respBody.key,hash: respBody.hash, size: respBody.fsize, mimeType: respBody.mimeType});
                }else {
                    reject(JSON.stringify(respInfo));
                }
            }
        })
    })
};



module.exports = {
    formatMessage,
    generatorData,
    uploadFile
};