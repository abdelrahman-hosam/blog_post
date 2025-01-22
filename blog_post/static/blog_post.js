function create_post(){
    const msg = document.getElementById('errmsg')
    const blog = document.getElementById('blog')
    blog.style.display = 'flex'
    if(msg) msg.remove();
}
function cancel(){
    const blog = document.getElementById('blog')
    blog.style.display = 'none'
}
async function submit(){
    const blogHeader = document.getElementById('blogHeader').value , blogContent = document.getElementById('blogContent').value , blogTags = document.getElementById('blogTags').value
    var errmsg = document.getElementById('errmsg')
    if(errmsg){
        errmsg.remove()
    }
    if(!blogHeader || !blogContent || !blogTags){
        var message = document.createElement('p')
        var card = document.getElementById('blog')
        message.setAttribute('id','errmsg')
        message.textContent = 'insert all the required data'
        card.appendChild(message)
        return
    }
    String(blogTags)
    const tags = blogTags.split(" ")
    const data = {
        "header": blogHeader,
        "content":blogContent,
        "tags": tags
    }
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('http://localhost:8000/api/post/create' , options)
    if(response.ok){
            var message = document.createElement('p')
            var card = document.getElementById('create_blog')
            cancel()
            message.setAttribute('id','okmsg')
            message.textContent = 'blog has successfully been created'
            card.appendChild(message)
        setTimeout(()=>{
            const msg = document.getElementById('okmsg')
            msg.remove()
            location.reload()
        } , 2000)
    }
}
document.addEventListener("DOMContentLoaded" , async()=>{
    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }
    const response = await fetch("http://localhost:8000/api/post/blogs" , options)
    if(response.ok){
        const res = await response.json()
        const blogs = res['posts'] 
        const main = document.getElementById('main')
        const username = res['username']
        await blogs.forEach(async blog => {
            const delete_id = blog['delete_id']
            const update_id = blog['update_id']
            const post = document.createElement('div')
            post.setAttribute('class' , 'post')
            post.setAttribute('data-delete-id' , delete_id)
            post.setAttribute('data-update-id' , update_id)
            const header = document.createElement('h2')
            const content = document.createElement('p')
            const tags = document.createElement('p')
            const del = document.createElement('button')
            const update = document.createElement('button')
            del.innerText = 'delete'
            update.innerText = 'update'
            del.setAttribute('id','del')
            update.setAttribute('id','update')
            update.addEventListener("click" , () => update_blog(update_id))
            del.addEventListener("click" , () => del_blog(delete_id , post))
            header.innerText = blog['header']
            content.innerText = blog['content']
            await blog['tags'].forEach(tag => {
                tags.innerText += `${tag} `
            })
            post.append(header , content , tags)
            if(blog['username'] === username){
                post.append(update , del)
            }
            main.append(post)
        });
    }
    return
})
async function update_blog(id){
    const newHeader = document.createElement('input'), 
          newContent = document.createElement('textarea'), 
          newTags = document.createElement('input'),
          confirm = document.createElement('button'),
          post = document.querySelector(`#main [data-update-id="${id}"]`),
          updateButton = document.querySelector(`#main [data-update-id="${id}"] #update`)
          console.log(post)
    confirm.addEventListener("click" , ()=> confirm_update(id , post , newHeader , newContent , newTags , confirm))
    console.log(id)
    confirm.setAttribute('id','confirm')
    confirm.innerText = 'confirm'
    newTags.setAttribute('id','newTag')
    newContent.setAttribute('id','newContent')
    newHeader.setAttribute('id','newHeader')
    newHeader.placeholder = 'insert new header'
    newContent.placeholder = 'insert new content'
    newTags.placeholder = 'insert new tags'
    updateButton.remove()
    post.append(newHeader , newContent , newTags,confirm)
}
async function confirm_update(id , post , header , content , tag , confirm){
    const newHeader = document.getElementById('newHeader').value
    const newContent = document.getElementById('newContent').value
    const newTags = document.getElementById('newTag').value
    const tags = newTags.split(" ")
    const data = {
        "header": newHeader,
        "tags": tags,
        "content": newContent,
        "update_id":id
    }
    const options = {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('http://localhost:8000/api/post/update', options)
    if(response.ok){
            var message = document.createElement('p')
            message.setAttribute('id','okmsg')
            message.textContent = 'blog has successfully been updated'
            post.appendChild(message)
            header.remove()
            tag.remove()
            content.remove()
            confirm.remove()
            const update = document.createElement('button')
            update.innerText = 'update'
            update.setAttribute('id','update')
            update.addEventListener("click" , () => update_blog(id))
            post.appendChild(update)
            setTimeout(()=>{
            const msg = document.getElementById('okmsg')
            msg.remove()
            cancel()
            location.reload()
        } , 2000)
    }
}
async function del_blog(id , post){
    const data = {
        "delete_id":id
    }
    const options = {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch('http://localhost:8000/api/post/delete' , options)
    if(response.ok){
        post.remove()
    }
}
async function search(){
const key = document.getElementById('search-criteria').value
if(!key){
    return
}
window.location.replace(`http://localhost:8000/search/${key}`)
}
