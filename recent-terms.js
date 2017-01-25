var mongo = require("mongodb").MongoClient
const MONGO_URL = process.env.MONGODB_IMAGE_SEARCH;

var addTerm = (query, callback) => {
    mongo.connect(MONGO_URL, (err, db) => {
        if(err) {
            return callback && callback("Falha ao connectar ao banco", null);
        }
        var term = {
            term: query,
            when: new Date
        };
        db.collection('recent_seach_terms').insert(term, (err, data) => {
            db.close();
            if(err || !data) {
                return callback && callback("Falha ao salvar termo de busca recente", null);
            }

            return callback && callback(null, term);
        })
    })
}
var getLatest10 = (callback) => {
    mongo.connect(MONGO_URL, (err, db) => {
        if(err) {
            return callback && callback("Falha ao connectar ao banco", null);
        }
        db.collection('recent_seach_terms').find({}, { limit : 10 }).sort({
            'when': -1
        }).toArray((err, data) => {
            db.close();
            return callback(err, data);
        });
    });
};
module.exports = {
    add: addTerm,
    latest10: getLatest10
};