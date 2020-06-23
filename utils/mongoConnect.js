const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var url = "mongodb://localhost:27017/";

const initMongoClient = (callback) => {
    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, client) {
        callback(err,client);
    });
};

function accessDb(dbName, collectionName, callback) {
    initMongoClient(function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        findDocuments(db, collectionName, {}, function (docs) {
            client.close();
            callback(docs);
        });
    });
};

function createUser(dbName, collectionName, data, callback) {
    initMongoClient(function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        var newUser = {
            ...data,
            createdAt: new Date(),
            role: data.role ? data.role : 'user',
            lastUpdated: new Date()
        };
        const query = { 'email': data.email };
        findDocuments(db, collectionName, query, function (docs) {
            if (docs.length > 0) {
                client.close();
                callback({ status: 409 })
            } else
                insertDocument(db, collectionName, newUser, function (res) {
                    client.close();
                    callback(res);
                });
        });
    });
};

function findUser(dbName, collectionName, data, callback) {
    initMongoClient(function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        const query = { 'email': data.email, 'password': data.password };
        findDocuments(db, collectionName, query, function (docs) {
            client.close();
            callback(docs)
        });
    });
};

function removeUser(dbName, collectionName, data, callback) {
    initMongoClient(function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        removeDocument(db, collectionName, data, function (res) {
            client.close();
            callback(res)
        });
    });
};

function updateUser(dbName, collectionName, data, callback) {
    initMongoClient(function (err, client) {
        if (err) throw err;
        var db = client.db(dbName);
        updateDocument(db, collectionName, data, function (res) {
            client.close();
            callback(res)
        });
    });
};

const findDocuments = function (db, collectionName, data, callback) {
    const collection = db.collection(collectionName);
    collection.find(data, { projection: { _id: 0, createdAt: 0, password: 0, lastUpdated: 0 } }).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};



const insertDocument = function (db, collectionName, newUser, callback) {
    db.collection(collectionName).insertOne(newUser, function (err, res) {
        if (err) throw err;
        callback(res);
    });
};

const removeDocument = function (db, collectionName, data, callback) {
    db.collection(collectionName).deleteOne(data, function (err, res) {
        if (err) throw err;
        callback(res);
    });
};

const updateDocument = function (db, collectionName, data, callback) {
    db.collection(collectionName).updateOne({ 'email': data.email }, 
    {$set: {
        ...data,
        lastUpdated: new Date()
    }}, 
    function (err, res) {
        if (err) throw err;
        callback(res);
    });
};

module.exports = {
    accessDb,
    findDocuments,
    createUser,
    findUser,
    removeUser,
    updateUser
}