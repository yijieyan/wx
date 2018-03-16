let request = require('request-promise');
let util = require('util');
let fs = require('fs');
let path = require('path');
let writeFile = util.promisify(fs.writeFile);
let readFile = util.promisify(fs.readFile);
let {tokenUrl, prefix} = require('../config/url');
let {appID, appsecret} = require('../config/config');

module.exports = async (ctx, next) => {
    try {

        ctx.success = function (data, error, code) {
            ctx.body = {
                code: code ? code : 0,
                success: data ? data : null,
                err: error ? error : null
            };
        };
        let data = await readFile(path.resolve(__dirname, '../data.json'), 'utf-8');
        let that = data || JSON.stringify({});
        if (!data) {
            await getToken(ctx, that);
        } else {
            data = JSON.parse(data);

            let ticketObj = data.ticket || {};
            data = data.token;
            if (data.expires_in < Date.now()) {
                await getToken(ctx, that);
            } else {
                ctx.token = data.access_token;
            }
            if (Object.keys(ticketObj).length === 0) {
                await getTicket(ctx, that);
            } else {
                if (ticketObj.expires_in < Date.now()) {
                    await getTicket(ctx, that);
                } else {
                    ctx.ticket = ticketObj.ticket;
                }
            }
        }
        await next();
    } catch (err) {
        console.log(err);
    }
};


async function getToken(ctx, that) {

    let options = {
        method: 'get',
        uri: `${tokenUrl}&appid=${appID}&secret=${appsecret}`
    };
    let res = await request(options);
    res = JSON.parse(res);
    ctx.token = res.access_token;
    let time = Date.now() + (res.expires_in - 5 * 60) * 1000;
    let data = JSON.parse(that);
    data.token = {access_token: res.access_token, expires_in: time};
    let str = JSON.stringify(data);
    await writeFile(path.resolve(__dirname, '../data.json'), str, 'utf-8');
}

async function getTicket(ctx, that) {
    let options = {
        method: 'get',
        uri: `${prefix}ticket/getticket?access_token=${ctx.token}&type=jsapi`
    };
    let res = await request(options);
    res = JSON.parse(res);
    ctx.ticket = res.ticket;
    let data = JSON.parse(that);
    let time = Date.now() + (res.expires_in - 5 * 60) * 1000;
    data.ticket = {ticket: res.ticket, expires_in: time};
    let str = JSON.stringify(data);
    await writeFile(path.resolve(__dirname, '../data.json'), str, 'utf-8');
}
