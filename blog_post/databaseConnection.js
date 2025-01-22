const express = require("express")
const app = express()
const { MongoClient } = require("mongodb")
let dbconnection
module.exports = {
    connectToDb: (cb) => {
        const uri = 'mongodb+srv://abdelrahmanhossam4532:93AvOvjOaTV13dLV@cluster0.jyr2n.mongodb.net/blog_POST?retryWrites=true&w=majority&appName=Cluster0'
        MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
          })
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
