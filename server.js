var express = require("express")
var search = require("./search.js")
var recentTerms = require("./recent-terms.js")

var port = process.env.PORT || 8080;

var app = express();

app.use('/static', express.static(__dirname + '/public'))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get("/api/search?*", (req, res) => {
    recentTerms.add(req.query.q);
    search(req.query.q, req.query.offset, (err, data) => {
        if(err || typeof data != 'object') {
            data = [];
        }
        res.send(JSON.stringify(data));
    });
})

app.get("/api/recent", (req, res) => {
    recentTerms.latest10((err, data) => {
        if(err) {
            data = {"error": "Could not find recent search terms"};
        }
        var data = data.map(item => {
            return {term: item.term, when: item.when};
        });
        res.send(JSON.stringify(data));
    })
})

app.listen(port, () => console.log("Image Search app listening on port " + port));