const express = require("express")
const http = require("http")
const { MongoClient } = require("mongodb")
const path = require("path")
const { connectToDb, getDb } = require("./databaseConnection")
const cookieParser = require('cookie-parser')
const {create , update_blog , get_blogs , delete_blog, search} = require('./blog_post-API')
const app = express()
const {login , register , logout} = require('./register_login')
const runserver = http.createServer(app)
const PORT = process.env.PORT || 8000
//connection
let db
connectToDb((err) => {
    if(!err){
        runserver.listen(PORT , ()=> console.log("server is running"))
    }
    db = getDb()
})
//middleware
app.use(express.static(path.join(__dirname , 'static')))
app.use(express.json())
app.use(cookieParser())
//page routes
app.get('/' , (req,res) => res.sendFile(path.join(__dirname , 'views', 'login_page.html')))
app.get('/register' , (req , res) => res.sendFile(path.join(__dirname , 'views', 'register_page.html')))
app.get('/homepage' , (req,res) => res.sendFile(path.join(__dirname , 'views' , 'blog_post.html')))
app.get('/search/:key' , (req,res) => res.sendFile(path.join(__dirname , 'views' , 'search.html')))
//api routes
app.post('/api/login', login)
app.post('/api/register' , register)
app.post('/api/logout' , logout)
app.post('/api/post/create' , create)
app.patch('/api/post/update' , update_blog)
app.get('/api/post/blogs' , get_blogs)
app.delete('/api/post/delete',delete_blog)
app.post('/api/post/search/:key' , search)