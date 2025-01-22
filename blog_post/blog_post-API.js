const express = require('express')
const app = express()
const { connectToDb, getDb } = require("./databaseConnection")
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const uuid = require('uuid')
let db
connectToDb((err) => {
    if(!err){
        
    }
    db = getDb()
})
const create_tokens = () => {
    const delete_id = uuid.v4()
    const update_id = uuid.v4()
    return {delete_id , update_id}
}
const create = async(req , res) =>{
    try{
        const { header , content , tags } = req.body
        const username = req.cookies.username
        if(!tags || tags.length === 0) return res.status(400).json({"error":"no tags sent" , "valid": false})
        if(!header || !content) return res.status(400).json({"error":"insert all the required data" , "valid": false})
        if(!username) return res.status(401).json({"error":"the user is not authenticated" , "valid": false})
        const {delete_id , update_id} = create_tokens()
        await db.collection('blogs').insertOne({header , content , tags: tags , username , delete_id , update_id})
        return res.status(200).json({"message": "blog was successfully created" , "valid":true})
    }catch(err){
        return res.status(500).json({"message":"something went wrong" , "valid":null , "error":err})
    }
}
const get_blogs = async(req , res) => {
    try{
        const blogs = await db.collection('blogs').find({} , {projection: {_id:0}}).toArray()
        const username = req.cookies.username
        if(!username) return res.status(401).json({"message":"this user is not authenticated" , "valid":false})
        return res.status(200).json({"message": "blogs retrieved successfully" , "valid": true , "posts": blogs , "username":username})
    }catch(err){
        res.status(500).json({"message":"something went wrong" , "error": err})
    }
} 
const update_blog = async(req , res)=>{
    try{
        const {header , tags , content , update_id} = req.body
        const username = req.cookies.username? req.cookies.username: undefined
        if(!username) return res.status(401).json({"message": "this user is not authenticated" , "valid": false})
        if(!update_id || (!header && (!tags || tags.length === 0) && !content)) return res.status(400).json({"message": "insert the required data" , "valid":false})
        const blog = await db.collection('blogs').findOne({username: username , update_id: update_id})
        if(!blog || blog.length === 0) return res.status(400).json({"message": "the blog does not exist or the user do not have permission to update it" , "valid": false})
        const newHeader = header? header:blog['header']
        const newContent = content? content:blog['content']
        const newTags = tags[0] !== '' && tags.length > 0? tags:blog['tags']
        await db.collection('blogs').updateOne({update_id: update_id} , {$set: {header: newHeader , content: newContent , tags: newTags}})
        return res.status(200).json({"message": "post was updated successfully" , "valid": true})
    }catch(err){
        return res.status(500).json({"message":"something wrong happened" , "error":err})
    }
}
const delete_blog = async(req,res) => {
    try{
        const delete_id = req.body.delete_id
        const username = req.cookies.username
        if(!username) return res.status(401).json({"message":"user is not authenticated" , "valid":false})
        if(!delete_id) return res.status(400).json({"message":"insert all the required inforamtion" , "valid":false})
        const blog = await db.collection('blogs').findOne({delete_id:delete_id})
        if(!blog || blog.username !== username)return res.status(400).json({"message":"blog does not exist or user do not have permission to do this action" , "valid":false})
        await db.collection('blogs').deleteOne({delete_id:delete_id})
        return res.status(200).json({"message":"blog was deleted successfully" , "valid":true})
    }catch(err){
        return res.status(500).json({"message":"something went wrong" , "error": err , "valid": null})
    }
}
const search = async(req , res) => {
    try{
    const searchKey = req.params.key
    const username = req.cookies.username
    if(!username) return res.status(401).json({"message":"The user is not authenticated" , "valid":false})
    if(!searchKey) return res.status(400).json({"message":"insert all the required data", "valid":false})
    const blogs = await db.collection('blogs').find({$or: [{username: searchKey} , {tags: searchKey}]} , {projection: {_id: 0}}).toArray()
    if(blogs.length === 0)return res.status(404).json({"message":"there are no blogs with the given criteria"})
    return res.status(200).json({"message":"blogs were retrieved successfully" , "valid": true , "blogs":blogs , "username":username})
    }catch(err){
        return res.status(500).json({"message":"something went wrong" , "err":err})
    }
}
module.exports = {
    create,
    update_blog,
    get_blogs,
    delete_blog,
    search
}