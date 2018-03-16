const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let filmSchema = new Schema({
    id: Number,  // 电影id
    title: String, //电影的名字
    rate: String,  // 电影的评分
    poster: String,  // 电影的海报
    src: String,    // 电影的播放首屏
    video: String,   // 电影的视频地址
    countries: [String],  // 国家
    type: [String], // 类型
    summary: String, // 描述
    directors: [String], // 导演
    casts: [String], //主演
    status: {   // 状态，默认上架
        type: Boolean,
        default: true
    },
    year: Date //上映时间
}, {versionKey: false, timestamps: true});
module.exports = mongoose.model('film', filmSchema);