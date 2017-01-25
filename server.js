var express = require("express")
var mongo = require("mongodb").MongoClient
var port = process.env.PORT || 8080;

var app = express();

app.use('/static', express.static(__dirname + '/public'))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get("/api/search", (req, res) => {
    var data = JSON.stringify({});
    res.send(data);
})

app.get("/api/recent", (req, res) => {
    var data = JSON.stringify({});
    res.send(data);
})

app.listen(port, () => console.log("Image Search app listening on port " + port));