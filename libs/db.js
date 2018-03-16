const mongoose = require('mongoose');
const {dbUrl} = require('../config/config');

mongoose.Promise = global.Promise;



module.exports = () => {
    let count = 0;
    let db;
    mongoose.set('debug', true);
    connect();
    function connect() {
        mongoose.connect(dbUrl);
        db = mongoose.connection;
        db.on('error', (err) => {
            console.log(`mongoose err: ${err}`);
        });

        db.once('open', () => {
            console.log(`connect ${dbUrl} successful!`);
        });

        db.on('disconnected', () => {
            if (count < 3) {
                connect();
                count++;
            }else {
                throw new Error('少年数据库挂了,快去修吧');
            }
        })
    };
};