module.exports = {
    tokenUrl:'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
    setMenus: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=',
    getMenus: 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=',
    deleteMenus: 'https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=',
    tempMaterialUpload: 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=',
    tempMaterialGet: 'https://api.weixin.qq.com/cgi-bin/media/get?access_token=',
    prefix: 'https://api.weixin.qq.com/cgi-bin/',
    getPermanentMaterial: 'https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=',
    deletePermantMaterial: 'https://api.weixin.qq.com/cgi-bin/material/del_material?access_token=',
    getMaterialCount: 'https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token='
};
