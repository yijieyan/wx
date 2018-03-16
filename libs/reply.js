let heredoc = require('heredoc');
let path = require('path');
let nanoid = require('nanoid');
let ejs = require('ejs');
let request = require('request-promise');
let cheerio = require('cheerio');
let superagent = require('superagent');
let Film = require('../models/film');
let {qiniuUrl, weixinUrl} = require('../config/config');
let {generatorData, uploadFile } = require('./util');

async function reply(data, token) {
    let res = '';
    if (data.MsgType === 'event') {
        if (data.Event === 'subscribe') {
            let content = '欢迎关注本公众号: \n'
                        + '在输入框输入电影名称就可以搜索到你想看的电影简介\n'
                        + '例如: 捉妖记2'
                        + '点击<a href="http://film.yanyijie.xyz">欣赏电影片段</a>';
            let info = generatorData(content, data);
            res = compiled(info);
        } else if (data.Event === 'unsubscribe') {
            let content = '无情取关';
            console.log(content);
            let info = generatorData(content, data);
            res = compiled(info);
        } else if (data.Event === 'LOCATION') {
            let content = `您的位置,经度:${data.Longitude},维度是:${data.Latitude}`;
            let info = generatorData(content, data);
            res = compiled(info);
        }
    } else if (data.MsgType === 'text') {

        if (data.Content === '欣赏' || data.Content=== '电影片段') {
            let content = '请<a href="http://film.yanyijie.xyz">点击</a>去欣赏';
            let info = generatorData(content, data);
            res = compiled(info);
        }else {
            let result = await Film.findOne({title: data.Content});
            if (result && Object.keys(result).length != 0) {
                let content = [];
                content = [
                    {
                        title: result.title,
                        description: `搜索出的电影${result.title}`,
                        picurl: result.poster,
                        url: `${weixinUrl}/movie?id=${result.id}`

                    }
                ];

                let info = generatorData(content, data);
                res = compiled(info);

            } else {
                let subjects = await getFilmDataFromDouban(data.Content);
                if (subjects && subjects.length > 0) {
                    let content = [];
                    if (subjects.length > 3) {
                        ret = subjects.slice(0, 3);
                    } else {
                        ret = subjects;
                    }

                    let arr = [];
                    for (let i =0; i< ret.length; i++) {
                        let item = ret[i];
                        content.push({
                            title: item.title,
                            description: `搜索出的电影${item.title}`,
                            picurl: item.images.large,
                            url: `${weixinUrl}/movie?id=${item.id}`
                        });

                        let obj = await Film.findOne({title: item.title});
                        if (!obj) {
                            arr.push(item);
                        }
                    }


                    let info = generatorData(content, data);
                    res = compiled(info);
                    await getFilmDataMore(arr);



                } else {
                    let content = `没有搜到关于${data.Content}的结果`;
                    let info = generatorData(content, data);
                    res = compiled(info);
                }
            }
        }
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
            <Content><![CDATA[<%-content%>]]></Content>
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
*/
});


let compiled = ejs.compile(tpl);


let getFilmDataFromDouban = async (q) => {
    let options = {
        uri: `https://api.douban.com/v2/movie/search`,
        qs: {
            q: q
        },
        method: 'GET',
        json: true
    };
    let result = await request(options);
    let subjects = typeof result === 'string' ? JSON.parse(result).subjects : result.subjects;
    if (subjects.length > 3) {
        subjects = subjects.slice(1, 3);
    }
    return subjects;
};


let getFilmDataMore = async (subjects) => {
    subjects.forEach(async item => {
        let data = await uploadFile(item.images.large, `${nanoid()}.jpg`);

        let directors = [];
        item.directors.forEach(item => {
            directors.push(item.name)
        });

        let casts = [];
        item.casts.forEach(item => {
            casts.push(item.name);
        });


        let detail = await request({
            uri: `https://api.douban.com/v2/movie/subject/${item.id}`,
            method: 'GET'
        });

        detail = typeof detail === 'string' ? JSON.parse(detail) : detail;


        // todo 爬取封面图和视频并上传七牛云
        let res = await superagent(`https://movie.douban.com/subject/${item.id}`);
        let $ = cheerio.load(res.text);
        let link = $('#related-pic ul .related-pic-video').attr('href');
        let cover = $('#related-pic ul .related-pic-video img').attr('src');
        let coverPic = {};
        if (cover) {
            coverPic = await uploadFile(cover, `{nanoid()}.jpg`);
        }

        let qiniuVideo = {};
        if (link) {
            let resVideo = await superagent(`${link}`);
            let $v = cheerio.load(resVideo.text);
            let videoUrl = $v('source').attr('src');
            qiniuVideo = await uploadFile(videoUrl, `${nanoid()}.mp4`);
        }

        await Film.create({
            id: item.id,
            title: item.title,
            rate: item.rating.average,
            poster: `${qiniuUrl}${data.key}`,
            year: new Date(item.year),
            countries: detail.countries,
            type: item.genres,
            summary: detail.summary,
            directors,
            casts,
            src: coverPic.key ? `${qiniuUrl}${coverPic.key}` : '',
            video: qiniuVideo.key ? `${qiniuUrl}${qiniuVideo.key}` : ''
        });

    });
};


module.exports = {
    reply,
    compiled
};