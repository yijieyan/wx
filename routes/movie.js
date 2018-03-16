const router = require('koa-router')();
let config = require('../config/config');
let sha1 = require('sha1');
let {setMenus, getMenus, deleteMenus} = require('../config/url');
let request = require('request-promise');
let {appID, appsecret} = require('../config/config');
let {reply, compiled} = require('../libs/reply');
let {generatorData} = require('../libs/util');
let Film = require('../models/film');


router.prefix('/movie');

router.get('/', async (ctx, next)=> {
    let id = ctx.query.id;
    let result ;
    result = await Film.findOne({id: +id});
    while(!result) {
        await sleep(1000);
        result = await Film.findOne({id: +id});
    }
    await ctx.render('index', {
        title: result.title,
        poster: result.poster,
        rate: result.rate,
        year: result.year,
        summary: result.summary,
        countries: result.countries,
        type: result.type,
        directors: result.directors,
        casts: result.casts,
        id:id
    })
});

router.get('/signature', async (ctx, next) => {
    let url = decodeURIComponent(ctx.query.targetUrl);
    let noncestr = Math.random().toString(36).substr(2,15);
    let jsapi_ticket = ctx.ticket;
    let timestamp = parseInt(Date.now()/1000);
    let str = ['noncestr='+noncestr, 'jsapi_ticket='+jsapi_ticket, 'timestamp='+timestamp, 'url='+url].sort().join('&');
    let signature = sha1(str);

    ctx.body = {
        appId: config.appID,
        timestamp,
        nonceStr: noncestr,
        signature
    }
});



let sleep = function(timer) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve();
      },timer);
  })
};

module.exports = router;