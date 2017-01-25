var express = require("express")
var request = require("request");
var urlHelper = require("url");
var mongo = require("mongodb").MongoClient
var port = process.env.PORT || 8080;
const GOOGLE_API_SEARCH_ENDPOINT = "https://www.googleapis.com/customsearch/v1";
const GOOGLE_API_SEARCH_CX = process.env.GOOGLE_API_SEARCH_CX;
const GOOGLE_API_SEARCH_KEY = process.env.GOOGLE_API_SEARCH_KEY;

var search = (query, offset, callback) => {
    var url = urlHelper.parse(GOOGLE_API_SEARCH_ENDPOINT);
    url.query = {
        q: query,
        start: offset ? parseInt(offset) : 1,
        cx: GOOGLE_API_SEARCH_CX,
        key: GOOGLE_API_SEARCH_KEY,
        searchType: 'image',
        fields: "items(image(contextLink,thumbnailLink),link,snippet)"
    }
    url = urlHelper.format(url);
    request({url}, (error, response, body) => {
        if(error || response.statusCode != 200){
            return callback("Error searching for '" + query +"'");
        }
        var data = JSON.parse(body);
        var items = [];
        if (data && data.items.length) {
            items = data.items.map(item => {
                return {
                    url: item.link ? item.link : "",
                    snippet: item.snippet ? item.snippet : "",
                    thumbnail: item.image && item.image.thumbnailLink ? item.image.thumbnailLink : "",
                    context: item.image && item.image.contextLink ? item.image.contextLink : ""
                };
            });
        }
        return callback(null, items);
    })
}
var app = express();

app.use('/static', express.static(__dirname + '/public'))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get("/api/search?*", (req, res) => {
    search(req.query.q, req.query.offset, (err, data) => {
        if(err || typeof data != 'object') {
            data = [];
        }
        res.send(JSON.stringify(data));
    });
})

app.get("/api/recent", (req, res) => {
    var data = JSON.stringify({});
    res.send(data);
})

app.listen(port, () => console.log("Image Search app listening on port " + port));