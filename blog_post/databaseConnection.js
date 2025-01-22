const express = require("express")
const app = express()
const { MongoClient } = require("mongodb")
let dbconnection
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/blog_POST')
        .then((client) => {
           dbconnection = client.db()
           return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () =>  dbconnection
}