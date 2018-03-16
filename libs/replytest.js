let heredoc = require('heredoc');
let path = require('path');
let ejs = require('ejs');
let {generatorData} = require('./util');
let {uploadTemporaryMaterial, getTempMaterial, uploadPermanentPic, uploadPermanentMaterial, uploadPermanentNew, getPermanentMaterials, deletePermanentMaterials, getMaterialCounts
    ,createLabel, getLabels, editLabel, delLabel, getLabelList, addLabelToUsers, cancelLabelToUsers, getUsersLabel, setUserRemark, getUserInformation, getUserListInformation,
    getUserLists, getblacklist, batchblacklist, batchunblacklist, createTicket, longUrlToShortUrl} = require('./material');

async function reply(data, token) {
    let res = '';
    if (data.MsgType === 'event') {
        if (data.Event === 'subscribe') {
            let content = '你好,欢迎关注本公众号';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Event === 'unsubscribe') {
            let content = '无情取关';
            console.log(content);
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Event === 'LOCATION') {
            let content = `您的位置,经度:${data.Longitude},维度是:${data.Latitude}`;
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (/^qrscene_/.test(data.EventKey)) {
            console.log(data);
        }else if (data.Event === 'SCAN') {
            console.log(data);
        }
    }else if (data.MsgType === 'text') {
        if (data.Content === '1') {
            let content = '天下第一';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '2') {
            let content = [
                {
                    title: 'nodejs',
                    description: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 \n' +
                    'Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。 \n' +
                    'Node.js 的包管理器 npm，是全球最大的开源库生态系统。',
                    picurl: 'https://ss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=c01d6e9caa1ea8d395227204a70b30cf/43a7d933c895d1435eac3d047ff082025aaf073b.jpg',
                    url:'http://nodejs.cn/'
                }
            ];
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '3') {
            let type = 'image';
            let file = path.resolve(__dirname, '../pics/1.jpg');
            let result = await uploadTemporaryMaterial(token, type, file);
            let content = {};
            content.type = 'image';
            content.media_id = result.media_id;
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '4') {
            let type = 'video';
            let file = path.resolve(__dirname, '../pics/2.mp4');
            let result = await uploadTemporaryMaterial(token, type, file);
            let content = {};
            content.type = 'video';
            content.title = '小提琴';
            content.description = '一段小提琴演奏的泰坦尼克号主题曲';
            content.media_id = result.media_id;
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '5') {
            let type = 'video';
            let file = path.resolve(__dirname, '../pics/2.mp4');
            let ret = await uploadTemporaryMaterial(token, type, file);
            let result = await getTempMaterial(token, ret.media_id);
            let content = result.video_url;
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '6') {
            let file = path.resolve(__dirname, '../pics/1.jpg');
            let ret = await uploadPermanentPic(token, file);
            let content = ret.url;
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '7') {
            let file = path.resolve(__dirname, '../pics/2.mp4');
            let obj = {};
            let type = 'video';
            if (type === 'video') {
                obj = {
                    title: 'mv',
                    introduction: '小提琴'
                }
            }
            let ret = await uploadPermanentMaterial(token, file, obj, 'video');
            console.log(ret);
            console.log({media_id: ret.media_id,url: ret.url});
            let content = {};
            content.type = 'video';
            content.media_id = ret.media_id;
            content.title = 'mv';
            content.description = '小提琴';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '8') {
            let file = path.resolve(__dirname, '../pics/1.jpg');
            let obj = {};
            let type = 'image';
            let ret = await uploadPermanentMaterial(token, file, obj,type);
            let content = {};
            content.type = 'image';
            content.media_id = ret.media_id;
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '9') {
            let file = path.resolve(__dirname, '../pics/1.jpg');
            let result = await uploadPermanentMaterial(token, file, {},'image');
            let obj = {
                title: 'lol',
                thumb_media_id: result.media_id,
                author: 'tom',
                content: '《英雄联盟》(简称LOL)是由美国拳头游戏(Riot Games)开发、中国大陆地区腾讯游戏代理运营的英雄对战MOBA竞技网游。\n' +
                '游戏里拥有数百个个性英雄，并拥有排位系统、符文系统等特色养成系统。\n' +
                '《英雄联盟》还致力于推动全球电子竞技的发展，除了联动各赛区发展职业联赛、打造电竞体系之外，每年还会举办“季中冠军赛”“全球总决赛”“All Star全明星赛”三大世界级赛事，获得了亿万玩家的喜爱，形成了自己独有的电子竞技文化。',
                content_source_url: 'https://github.com/'
            };
            let ret = await uploadPermanentNew(token, obj);
            console.log(ret.media_id);
            let content = [];
            content.type = 'news';
            content = [
                {
                    title: obj.title,
                    description: '《英雄联盟》(简称LOL)是由美国拳头游戏(Riot Games)开发、中国大陆地区腾讯游戏代理运营的英雄对战MOBA竞技网游。',
                    picurl: result.url,
                    url: 'https://github.com/'
                }
            ];
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '11') {
            let media_id = '89YJ4Bz1LBbaHeR7e86HoqJmqzps2HXnJa0sG_SXwzk';
            let ret = await getPermanentMaterials(token, media_id);
            let content = JSON.stringify(ret);
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '12') {
            let media_id = '89YJ4Bz1LBbaHeR7e86HoqJmqzps2HXnJa0sG_SXwzk';
            ret = await deletePermanentMaterials(token, media_id);
            let content = JSON.stringify(ret);
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '13') {
            let ret = await getMaterialCounts(token);
            let content = JSON.stringify(ret);
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '14') {
            let tag = {
                name: 'it'
            };
            // let ret1 = await createLabel(token, tag);
            // console.log('----------------------------------------');
            // console.log('新增tag:',ret1);
            // console.log('----------------------------------------');
            // let ret2 = await getLabels(token);
            // console.log('*****************************************');
            // console.log('获取tag:',ret2);
            // console.log('*****************************************');
            // let ret3 = await editLabel(token, {id: 100, name: '广东人'});
            // console.log('-----------------------------------------');
            // console.log('编辑tag:', ret3);
            // console.log('-----------------------------------------');
            // let ret4 = await delLabel(token, {id: 100});
            // console.log('*****************************************');
            // console.log('删除tag:',ret4);
            // console.log('*****************************************');
            // let ret5 = await getLabels(token);
            // console.log('*****************************************');
            // console.log('获取tag:',ret5);
            // console.log('*****************************************');
            // let ret6 = await addLabelToUsers(token, ['oPi6owFwazs9vsI89CTzXTgBLvEk'],101);
            // console.log('----------------------------------------');
            // console.log('批量为用户打标签:',ret6);
            // console.log('----------------------------------------');
            // let ret7 = await getLabelList(token, 101, '');
            // console.log('*****************************************');
            // console.log('获取标签下粉丝列表:',ret7);
            // console.log('*****************************************');
            // let ret8 = await getUsersLabel(token, 'oPi6owFwazs9vsI89CTzXTgBLvEk');
            // console.log('----------------------------------------');
            // console.log('获取用户身上的标签列表:',ret8);
            // console.log('----------------------------------------');
            // let ret9 = await cancelLabelToUsers(token, ['oPi6owFwazs9vsI89CTzXTgBLvEk'], 101);
            // console.log('*****************************************');
            // console.log('批量为用户取消标签:',ret9);
            // console.log('*****************************************');
            // let ret10 = await getLabelList(token, 101, '');
            // console.log('-----------------------------------------');
            // console.log('获取标签下粉丝列表:',ret10);
            // console.log('-----------------------------------------');
            let content = '14';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '15') {
            let ret = await setUserRemark(token, 'oPi6owFwazs9vsI89CTzXTgBLvEk', 'nodejs');
            console.log('---------------------------------------------');
            console.log('设置用户备注名:',ret);
            console.log('---------------------------------------------');
            let content = '15';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '16') {
            let ret1 = await getUserInformation(token, 'oPi6owFwazs9vsI89CTzXTgBLvEk', 'zh_CN');
            console.log('---------------------------------------------');
            console.log('获取用户基本信息:',ret1);
            console.log('---------------------------------------------');
            let ret2 = await getUserListInformation(token, [{openid: 'oPi6owFwazs9vsI89CTzXTgBLvEk', lang: 'zh_CN'}]);
            console.log('*********************************************');
            console.log('批量获取用户基本信息:',ret2);
            console.log('*********************************************');
            let content = '16';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '17') {
            let ret = await getUserLists(token, '');
            console.log('---------------------------------------------');
            console.log('获取用户列表:',ret);
            console.log('---------------------------------------------');
            let content = '17';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '18') {
            let ret1 = await getblacklist(token, '');
            console.log('---------------------------------------------');
            console.log('黑名单列表:',ret1);
            console.log('---------------------------------------------');
            let ret2 = await batchblacklist(token, ['oPi6owFwazs9vsI89CTzXTgBLvEk']);
            console.log('*********************************************');
            console.log('拉黑用户:',ret2);
            console.log('*********************************************');
            let ret3 = await getblacklist(token, '');
            console.log('---------------------------------------------');
            console.log('黑名单列表:',ret3);
            console.log('---------------------------------------------');
            let ret4 = await batchunblacklist(token, ['oPi6owFwazs9vsI89CTzXTgBLvEk']);
            console.log('*********************************************');
            console.log('取消拉黑用户:',ret4);
            console.log('*********************************************');
            let ret5 = await getblacklist(token, '');
            console.log('---------------------------------------------');
            console.log('黑名单列表:',ret5);
            console.log('---------------------------------------------');
            let content = '18';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '19') {
            let ret = await createTicket(token, {expire_seconds: 604800, action_name: 'QR_SCENE', action_info: {
                scene: {
                    scene_id: '123'
                }
            }});
            console.log('---------------------------------------------');
            console.log('ticket:',ret);
            console.log('---------------------------------------------');
            let content = '19';
            let info = generatorData(content, data);
            res = compiled(info);
        }else if (data.Content === '20') {
            let ret = await longUrlToShortUrl(token, 'http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%87&hs=0&pn=0&spn=0&di=97987891320&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=3588772980%2C2454248748&os=1031665791%2C326346256&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0142135541fe180000019ae9b8cf86.jpg%401280w_1l_2o_100sh.png&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bzv55s_z%26e3Bv54_z%26e3BvgAzdH3Fo56hAzdH3FZNzMxNTI8M2%3D%3D_z%26e3Bip4s&gsm=0');
            console.log('---------------------------------------------');
            console.log('shortUrl:',ret);
            console.log('---------------------------------------------');
            let content = ret.short_url;
            let info = generatorData(content, data);
            res = compiled(info);
        }

        else {
            let content = '你说的什么，我听不懂啊';
            let info = generatorData(content, data);
            res = compiled(info);
        }
    }else if (data.MsgType === 'location') {
        let content = `您的位置,经度:${data.Location_Y},维度是:${data.Location_X}, 地理位置信息:${data.Label}`;
        let info = generatorData(content, data);
        res = compiled(info);
    }else if (data.MsgType === 'link') {
        let content = `本条消息的链接的标题是:${data.Title},描述是:${data.Description},链接:${data.Url}`;
        let info = generatorData(content, data);
        res = compiled(info);
    }else if (data.MsgType === 'shortvideo') {
        let content = `本条小视频的视频消息媒体id:${data.MediaId},视频消息缩略图的媒体id:${data.ThumbMediaId}`;
        let info = generatorData(content, data);
        res = compiled(info);
    }else if (data.MsgType === 'video') {
        let content = `本条视频的视频消息媒体id:${data.MediaId},视频消息缩略图的媒体id:${data.ThumbMediaId}`;
    }else if (data.MsgType === 'voice') {
        let content = `本条语音消息媒体id:${data.MediaID}`;
        let info = generatorData(content, data);
        res = compiled(info);
    }else if (data.MsgType === 'image') {
        let content = `本张图片链接:${data.PicUrl}`;
        let info = generatorData(content, data);
        res = compiled(info);

    }
    return res;
}



let tpl = heredoc(() => {/*
    <xml>
        <ToUserName><![CDATA[<%=toUserName%>]]></ToUserName>
        <FromUserName><![CDATA[<%=fromUserName%>]]></FromUserName>
        <CreateTime><%=createTime%></CreateTime>
        <MsgType><![CDATA[<%=msgType%>]]></MsgType>
        <% if (msgType === 'text') {%>
            <Content><![CDATA[<%=content%>]]></Content>
        <% } else if (msgType === 'image') {%>
            <Image>
                <MediaId><![CDATA[<%=content.media_id%>]]></MediaId>
            </Image>
        <% }else if (msgType === 'voice'){%>
            <Voice>
                <MediaId><![CDATA[<%=content.media_id%>]]></MediaId>
            </Voice>
        <% }else if (msgType === 'video') {%>
            <Video>
                <MediaId><![CDATA[<%=content.media_id%>]]></MediaId>
                <Title><![CDATA[<%=content.title%>]]></Title>
                <Description><![CDATA[<%=content.description%>]]></Description>
            </Video>
        <% }else if (msgType === 'music') {%>
            <Music>
                <Title><![CDATA[<%=content.title%>]]></Title>
                <Description><![CDATA[<%=description%>]]></Description>
                <MusicUrl><![CDATA[<%=content.musicUrl%>]]></MusicUrl>
                <HQMusicUrl><![CDATA[<%=content.hqMusicUrl%>]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[<%=content.media_id%>]]></ThumbMediaId>
            </Music>
        <%}else if (msgType === 'news') {%>
            <ArticleCount><%=content.length%></ArticleCount>
            <Articles>
                <% content.forEach(item => {%>
                    <item>
                    <Title><![CDATA[<%=item.title%>]]></Title>
                    <Description><![CDATA[<%=item.description%>]]></Description>
                    <PicUrl><![CDATA[<%=item.picurl%>]]></PicUrl>
                    <Url><![CDATA[<%=item.url%>]]></Url>
                </item>
                <%})%>
            </Articles>
         <%}%>
    </xml>
*/});


let compiled = ejs.compile(tpl);

module.exports = {
    reply
};