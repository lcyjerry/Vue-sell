const appData = require('./data.json')
const seller  = appData.seller
const goods = appData.goods
const ratings = appData.ratings
const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    devServer: {
        before(app){
            app.get('/api/seller',function(req,res) {
                res.json({
                    errno: 0,
                    data:seller
                })
            })
            app.get('/api/goods',function(req,res) {
                res.json({ 
                    errno: 0,
                    data:goods
                })
            })
            app.get('/api/ratings',function(req,res) {
                res.json({
                    errno: 0,
                    data:ratings
                })
            })
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("common", resolve("src/common"))
            .set("components", resolve("src/components"))
            .set("public", resolve("public"));
        },
}