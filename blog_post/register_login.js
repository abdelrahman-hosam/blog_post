const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const { connectToDb, getDb } = require("./databaseConnection")
let db
connectToDb((err) => {
    if(!err){
        
    }
    db = getDb()
})
const register = async(req , res) => {
try
    {  
        const username = req.body.username
        const password = req.body.password
        console.log(username)
        console.log(password)
        if(!username || !password) return res.status(402).json({"message":"insert all the required fields" , "valid":false})
        const exists = await db.collection('users').find({username: username}).count()
        if(exists > 0){
            return res.status(400).json({"message":"username already exists" , "valid":false})
        }
        hashedPassword = bcrypt.hashSync(password , 10)
        await db.collection('users').insertOne({username: username , password: hashedPassword})
        return res.status(201).json({"message": "user is succesfully created"})
    }catch(err){
        return res.status(500).json({"message": "could not register" , "valid":null , "error":err})
    }
}
const login = async(req , res) =>{
    try{
        const username = req.body.username
        const password = req.body.password
        console.log(username)
        console.log(password)
        if(!username || !password) return res.status(401).json({"message":"insert all the required data" , "valid":false})
        const [user] = await db.collection('users').find({username: username}).toArray()
        if(!user) return res.status(400).json({"message":"password or username is incorrect" , "valid":false})
        const validPassword = bcrypt.compareSync(password, user.password)
        if(!validPassword) return res.status(400).json({"message":"password or username is incorrect" , "valid":false})
        res.cookie('username', username , {httpOnly: true})
        return res.status(200).json({"message":"user has successfully logged in"})
    }catch(err){
        return res.status(500).json({"message":"something wrong happened" , "valid":null , "error":err})
    }
}
const logout = (req,res) => {
    if(!req.cookies.username) return res.status(400).json({"message":"user is already logged out"})
    res.clearCookie("username")
    return res.status(200).json({"message":"user did log out successfully"})
}
module.exports = {
    login,
    register,
    logout
}