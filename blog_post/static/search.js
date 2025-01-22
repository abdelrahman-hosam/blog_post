document.addEventListener("DOMContentLoaded" , async() => {
    const query = window.location.pathname.split('/')
    const key = query[2]
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({"key":key})
    }
    const response = await fetch(`http://localhost:8000/api/post/search/${key}` , options)
    if(response.ok){
        const res = await response.json()
        const blogs = res["blogs"]
        const username = res["username"]
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
    })
    }
})