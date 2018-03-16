let request = require('request-promise');
let fs = require('fs');
let {tempMaterialUpload, tempMaterialGet, prefix, getPermanentMaterial, deletePermantMaterial, getMaterialCount} = require('../config/url');

/**
 * 上传临时素材
 */
let uploadTemporaryMaterial = async function(token, type, filePath) {
    try {
        let options = {
            uri: `${tempMaterialUpload}${token}&type=${type}`,
            method: 'POST',
            formData: {
                media: fs.createReadStream(filePath)
            }
        };

        let res = await request(options);
        res = JSON.parse(res);
        return res;
    }catch(err) {
        throw new Error('upload temp material fail');
    }
};

/**
 * 获取临时素材（视频）
 * @param token
 * @param media_id
 * @returns {Promise.<*>}
 */
let getTempMaterial = async function(token, media_id) {
    try {
        let options = {
            uri: `${tempMaterialGet}${token}&media_id=${media_id}`,
            method: 'GET'
        };
        let res = await request(options);
        res = JSON.parse(res);
        return res;
    }catch(err) {
        throw new Error('gett temp material fail');
    }
};

/**
 * 新增永久图文
 * @param token
 * @returns {Promise.<void>}
 */
let uploadPermanentNew = async function(token, obj) {
    let options = {
        uri: `${prefix}material/add_news?access_token=${token}`,
        method: 'POST',
        body: {
            articles: [
                {
                    title: obj.title,
                    thumb_media_id: obj.thumb_media_id,
                    author: obj.author,
                    show_cover_pic: 1,
                    content: obj.content,
                    content_source_url: obj.content_source_url
                }
            ]
        },
        json:true
    };

    let res = await request(options);
    return res;
};

/**
 * 上传图文消息内的图片获取URL
 * @param token
 * @param file
 * @returns {Promise.<*>}
 */
let uploadPermanentPic = async function (token, file) {
    let options = {
        uri: `${prefix}media/uploadimg?access_token=${token}`,
        method: 'post',
        formData: {
            media: fs.createReadStream(file)
        }
    };

    let res = await request(options);
    res = JSON.parse(res);
    return res;
};

/**
 * 上传永久素材
 * @param file
 * @param obj
 * @returns {Promise.<*>}
 */
let uploadPermanentMaterial = async function(token, file, obj,type) {
    let o = {};
    let options = {};
    if (Object.keys(obj).length === 0) {
        options = {
            uri: `${prefix}material/add_material?access_token=${token}&type=${type}`,
            method: 'POST',
            formData: {
                media: fs.createReadStream(file),
            }
        };
    }else {
        options = {
            uri: `${prefix}material/add_material?access_token=${token}&type=${type}`,
            method: 'POST',
            formData: {
                media: fs.createReadStream(file),
                description : JSON.stringify({
                    title: obj.title,
                    introduction: obj.introduction
                })
            }
        };
    }
    let res = await request(options);
    res = JSON.parse(res);
    return res;
};

/**
 * 获取永久素材
 * @param token
 * @param media_id
 * @returns {Promise.<*>}
 */
let getPermanentMaterials = async function(token, media_id) {
    let options = {
      uri: `${getPermanentMaterial}${token}`,
      method: 'POST',
      body: {
          media_id
      },
      json: true
    };

    let res = await request(options);
    return res;
};

/**
 * 删除永久素材
 * @param token
 * @param media_id
 * @returns {Promise.<*>}
 */
let deletePermanentMaterials = async function (token, media_id) {
    let options = {
        uri: `${deletePermantMaterial}${token}`,
        method: 'POST',
        body: {
            media_id
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res) : res;
    return res;
};

/**
 * 获取永久素材的数量
 * @param token
 * @returns {Promise.<*>}
 */
let getMaterialCounts = async function(token) {
    let options = {
      uri: `${getMaterialCount}${token}`,
      methid: 'GET'
    };
    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res) : res;
    return res;
};

/**
 * 创建标签
 * @param token
 * @param tag
 * @returns {Promise.<*>}
 */
let createLabel = async function(token, tag) {
    let options = {
        uri:`${prefix}tags/create?access_token=${token}`,
        method: 'POST',
        body: {
            tag
        },
        json: true
    };
    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res): res;
    return res;
};

/**
 * 获取标签列表
 * @param token
 * @returns {Promise.<*>}
 */
let getLabels = async function(token) {
    let options = {
        uri: `${prefix}tags/get?access_token=${token}`,
        method: 'GET'
    };
    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res) : res;
    return res;
};

/**
 * 编辑标签
 * @returns {Promise.<*>}
 */
let editLabel = async function(token, tag) {
    let options = {
        uri: `${prefix}tags/update?access_token=${token}`,
        method: 'POST',
        body: {
            tag
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res): res;
    return res;
};

/**
 * 删除标签
 * @param token
 * @param tag
 * @returns {Promise.<*>}
 */
let delLabel = async function(token, tag) {
    let options = {
        uri: `${prefix}tags/delete?access_token=${token}`,
        method: 'POST',
        body: {
            tag
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res): res;
    return res;
};

/**
 * 获取标签下粉丝列表
 * @param token
 * @param tagid
 * @param next_openid
 * @returns {Promise.<*>}
 */
let getLabelList = async function(token, tagid, next_openid) {
    let options = {
        uri: `${prefix}user/tag/get?access_token=${token}`,
        method: 'POST',
        body: {
            tagid,
            next_openid
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res) : res;
    return res;
};

/**
 * 批量为用户打标签
 * @param token
 * @param openid_list
 * @param tagid
 * @returns {Promise.<*>}
 */
let addLabelToUsers = async function(token, openid_list, tagid) {
    let options = {
        uri: `${prefix}tags/members/batchtagging?access_token=${token}`,
        method: 'POST',
        body: {
            openid_list,
            tagid
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res) : res;
    return res;
};

/**
 * 批量为用户取消标签
 * @param token
 * @param openid_list
 * @param tagid
 * @returns {Promise.<*>}
 */
let cancelLabelToUsers = async function(token, openid_list, tagid) {
    let options = {
        uri: `${prefix}tags/members/batchuntagging?access_token=${token}`,
        method: 'POST',
        body: {
            openid_list,
            tagid
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res):res;
    return res;
};

/**
 * 获取用户身上的标签列表
 * @param token
 * @param openid
 * @returns {Promise.<*>}
 */
let getUsersLabel = async function(token, openid) {
    let options = {
        uri: `${prefix}tags/getidlist?access_token=${token}`,
        method: 'POST',
        body: {
            openid
        },
        json: true
    };

    let res = await request(options);

    res = typeof res === 'string' ? JSON.parse(res) : res;
    return res;
};

/**
 * 设置用户备注名
 * @param token
 * @param openid
 * @param remark
 * @returns {Promise.<*>}
 */
let setUserRemark = async function(token, openid, remark) {
    let options = {
        uri: `${prefix}user/info/updateremark?access_token=${token}`,
        method: 'POST',
        body: {
            openid,
            remark
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res): res;
    return res;
};

/**
 * 获取用户基本信息
 * @param token
 * @param openid
 * @param lang
 * @returns {Promise.<*>}
 */
let getUserInformation = async function(token, openid, lang) {
    let options = {
        uri: `${prefix}user/info?access_token=${token}&openid=${openid}&lang=${lang}`,
        method: 'GET'
    };

    let res = await request(options);
    res = typeof res === 'string' ? JSON.parse(res): res;
    return res;
};

/**
 * 批量获取用户基本信息
 * @param token
 * @param user_list
 * @returns {Promise.<*>}
 */
let getUserListInformation = async function(token, user_list) {
    let options = {
        url: `${prefix}user/info/batchget?access_token=${token}`,
        method: 'POST',
        body: {
            user_list
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res): res;
    return res;
};

/**
 * 获取用户列表
 * @param token
 * @param next_openid
 * @returns {Promise.<*>}
 */
let getUserLists = async function(token, next_openid) {
    let options = {
        uri: `${prefix}user/get?access_token=${token}&next_openid=${next_openid}`,
        method: 'GET'
    };

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res): res;
    return res;
};

/**
 * 获取公众号的黑名单列表
 * @param token
 * @returns {Promise.<*>}
 */
let getblacklist = async function(token, begin_openid) {
    let options = {
        uri: `${prefix}tags/members/getblacklist?access_token=${token}`,
        method: 'POST',
        body: {
            begin_openid
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res): res;
    return res;
};

/**
 * 拉黑用户
 * @param token
 * @param openid_list
 * @returns {Promise.<*>}
 */
let batchblacklist = async function(token, openid_list) {
    let options = {
        uri: `${prefix}tags/members/batchblacklist?access_token=${token}`,
        method: 'POST',
        body: {
            openid_list
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res): res;
    return res;
};

/**
 * 取消拉黑用户
 * @param token
 * @param openid_list
 * @returns {Promise.<*>}
 */
let batchunblacklist = async function(token, openid_list) {
    let options = {
        uri: `${prefix}tags/members/batchunblacklist?access_token=${token}`,
        method: 'POST',
        body: {
            openid_list
        },
        json: true
    };

    let res = await request(options);
    res = typeof res ==='string'?JSON.parse(res): res;
    return res;
};

/**
 * 创建二维码ticket
 * @param token
 * @param obj
 * @returns {Promise.<*>}
 */
let createTicket = async function(token, obj) {
    let options = {
        uri: `${prefix}qrcode/create?access_token=${token}`,
        method: 'POST',
        json: true
    };

    if (obj.action_name === 'QR_SCENE') {
        options.body = {
            expire_seconds: obj.expire_seconds,
            action_name: 'QR_SCENE',
            action_info: obj.action_info
        }
    }else if (obj.action_name === 'QR_LIMIT_SCENE') {
        options.body = {
            action_name: 'QR_LIMIT_SCENE',
            action_info: obj.action_info
        }
    }

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res): res;
    return res;
};

/**
 * 长链接转短链
 * @param token
 * @param long_url
 * @returns {Promise.<*>}
 */
let longUrlToShortUrl = async function(token, long_url) {
    let options = {
        uri: `${prefix}shorturl?access_token=${token}`,
        method: 'POST',
        body: {
            long_url,
            action: 'long2short'
        },
        json: true
    };

    let res = await request(options);
    res = typeof res === 'string'? JSON.parse(res):res;
    return res;
};
module.exports = {
    uploadPermanentNew,
    getTempMaterial,
    uploadPermanentMaterial,
    uploadPermanentPic,
    uploadTemporaryMaterial,
    getPermanentMaterials,
    deletePermanentMaterials,
    getMaterialCounts,
    createLabel,
    getLabels,
    editLabel,
    delLabel,
    getLabelList,
    addLabelToUsers,
    cancelLabelToUsers,
    getUsersLabel,
    setUserRemark,
    getUserInformation,
    getUserListInformation,
    getUserLists,
    getblacklist,
    batchblacklist,
    batchunblacklist,
    createTicket,
    longUrlToShortUrl
};
