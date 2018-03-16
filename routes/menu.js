const router = require('koa-router')();
let config = require('../config/config');
let sha1 = require('sha1');
let {setMenus, getMenus, deleteMenus} = require('../config/url');
let request = require('request-promise');
let {appID, appsecret} = require('../config/config');

router.prefix('/menu');
/**
 * 设置菜单
 */
router.post('/setMenu', async (ctx, next) => {
    try {

        let body = {
            "button":[
                {
                    "type":"click",
                    "name":"今日歌曲",
                    "key":"V1001_TODAY_MUSIC"
                },
                {
                    "name":"菜单",
                    "sub_button":[
                        {
                            "type":"view",
                            "name":"搜索",
                            "url":"http://www.baidu.com/"
                        },
                        {
                            "name": "发送位置",
                            "type": "location_select",
                            "key": "rselfmenu_2_0"
                        },
                        {
                            "type": "pic_sysphoto",
                            "name": "系统拍照发图",
                            "key": "rselfmenu_1_0",
                            "sub_button": [ ]
                        },
                        {
                            "type": "pic_photo_or_album",
                            "name": "拍照或者相册发图",
                            "key": "rselfmenu_1_1",
                            "sub_button": [ ]
                        },
                        {
                            "type": "pic_weixin",
                            "name": "微信相册发图",
                            "key": "rselfmenu_1_2",
                            "sub_button": [ ]
                        }]
                },
                {
                    "name": "扫码",
                    "sub_button": [
                        {
                            "type": "scancode_waitmsg",
                            "name": "扫码带提示",
                            "key": "rselfmenu_0_0",
                            "sub_button": [ ]
                        },
                        {
                            "type": "scancode_push",
                            "name": "扫码推事件",
                            "key": "rselfmenu_0_1",
                            "sub_button": [ ]
                        }
                    ]
                }]
        };
        let options = {
            method: 'POST',
            uri: `${setMenus}${ctx.token}`,
            body,
            json: true
        };
        let res = await request(options);
        ctx.body = {
            code: 0,
            err:null,
            success: 'ok'
        }
    }catch(err) {
        throw  new Error('setting menus fail');
    }
});

/**
 * 获取菜单信息
 */
router.get('/getMenu', async (ctx, next) => {
    try {
        let options= {
            method: 'get',
            uri: `${getMenus}${ctx.token}`
        };
        let res = await request(options);
        ctx.success(res);

    }catch(err) {
        throw new Error('get menu fail');
    }
});

/**
 * 删除接口
 */
router.get('deleteMenu', async (ctx, next) => {
   try {
       let options = {
           method: 'get',
           uri: `${deleteMenus}${ctx.token}`
       };
       let res = await request(options);
       ctx.success('ok');
   }catch(err) {
       throw new Error('delete menus fail');
   }
});

module.exports = router;
