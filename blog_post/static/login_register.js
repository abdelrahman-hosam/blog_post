const fs = require('fs')
const path = require('path')
async function login(){
    var username = document.getElementById('username').value
    var password = document.getElementById('password').value
    var errmsg = document.getElementById('errmsg')
    if(errmsg){
        errmsg.remove()
    }
    if(!username || !password){
        var message = document.createElement('p')
        var card = document.getElementById('card')
        message.setAttribute('id','errmsg')
        message.textContent = 'insert the username and password'
        card.appendChild(message)
        return
    }
    const data ={
        'username': username,
        'password': password
    }
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    var response = await fetch('http://localhost:8000/api/login' , options)
    if(response.ok){
        window.location.replace('http://localhost:8000/homepage')
        return
    }else{
        var message = document.createElement('p')
        var card = document.getElementById('card')
        message.setAttribute('id','errmsg')
        message.textContent = 'username or password is wrong'
        card.appendChild(message)
        return
    }
}
async function register(){
    var username = document.getElementById('username').value
    var password = document.getElementById('password').value
    var errmsg = document.getElementById('errmsg')
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/
    if(errmsg){
        errmsg.remove()
    }
    if(!username || !password){
        var message = document.createElement('p')
        var card = document.getElementById('card')
        message.setAttribute('id','errmsg')
        message.textContent = 'insert the username and password'
        card.appendChild(message)
        return
    }
    if(!regex.test(password)){
        var message = document.createElement('p')
        var card = document.getElementById('card')
        message.setAttribute('id','errmsg')
        message.textContent = 'password must contain upper and lowercase letters and at least 1 special character and be at least 8 characters long'
        card.appendChild(message)
    }
    const data ={
        'username': username,
        'password': password
    }
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    var response = await fetch('http://localhost:8000/api/register' , options)
    var message = document.createElement('p')
    var card = document.getElementById('card')
    message.setAttribute('id','errmsg')
    if(response.status === 201){
        message.textContent = 'user is created successfully'
        card.appendChild(message)
        return
    }else{
        message.textContent = 'something went wrong'
        card.appendChild(message)
        return
    }
}