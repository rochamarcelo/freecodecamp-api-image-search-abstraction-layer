var request = require("request")
var urlHelper = require("url")

const GOOGLE_API_SEARCH_ENDPOINT = "https://www.googleapis.com/customsearch/v1";
const GOOGLE_API_SEARCH_CX = process.env.GOOGLE_API_SEARCH_CX;
const GOOGLE_API_SEARCH_KEY = process.env.GOOGLE_API_SEARCH_KEY;

module.exports = function(query, offset, callback) {
    console.log('Term: ', query);
    var url = urlHelper.parse(GOOGLE_API_SEARCH_ENDPOINT);
    url.query = {
        q: query.replace(" ", "+"),
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