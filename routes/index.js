const router = require('koa-router')();
let config = require('../config/config');
let sha1 = require('sha1');
let getRawBody = require('raw-body');
let parser = require('xml2json');
let {formatMessage} = require('../libs/util');
let {reply} = require('../libs/reply');
let {setMenus, getMenus} = require('../config/url');
let request = require('request-promise');
let {appID, appsecret} = require('../config/config');


/**
 * 配置服务器
 * @type {[type]}
 */
router.get('/wx', async (ctx, next) => {
  let token = config.token;
  let {signature, timestamp, nonce, echostr} = ctx.query;
  let arr = [token, timestamp, nonce];
  let str = sha1(arr.sort().join(''));
  if (str === signature) {
    ctx.body = echostr+ '';
    return true;
  }else {
    ctx.body = '出错了';
    return false;
  }
});


router.post('/wx', async (ctx, next) => {
    let xml = await getRawBody(ctx.req,{
        length: ctx.headers["content-length"],
        limit: '1mb',
        encoding: 'utf-8'
    });

    let data = formatMessage(JSON.parse(parser.toJson(xml)).xml);
    let res = await reply(data, ctx.token);
    ctx.type = 'application/xml';
    ctx.body = res;
});

module.exports = router;
