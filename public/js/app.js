let username
let socket=io()


do{
username=prompt("Enter Your name: ")
}while(!username)

const textarea=document.querySelector('#textarea')
const submitBtn=document.querySelector('#submitBtn');
const commentBox=document.querySelector('.comment_box')

submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let comment=textarea.value;

    if(!comment){
        return;
    }
    postComment(comment)
})


function postComment(comment){
    //append to dom
    let data={
        username:username,
        comment:comment,
    }
    appendToDom(data)
    textarea.value='';
    //broadcast
    broadcastComment(data)
    //sync with mongo Db
    syncWithDb(data)

}

function appendToDom(data){
    let lTag=document.createElement('li');
    lTag.classList.add('comment',"mb-3");

    let markup=`
    <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.comment}</p>
            <div>
                <img src="/img/clock.png" alt="clock" />
                <small>${moment(data.time).format('LT')}</small>
            </div>
        </div>
    </div>
    `

    lTag.innerHTML=markup

    commentBox.prepend(lTag);
}

function broadcastComment(data){
    //Socket code
    socket.emit('comment',data)
    
}

socket.on('comment',(data)=>{
    appendToDom(data);
})

let timerId=null;
function dedounce(func,timer){
    if(timerId){
        clearTimeout(timerId)
    }
    timerid=setTimeout(()=>{
        func()
    },timer)
}
let typingDiv=document.querySelector('.typing');
socket.on('typing',(data)=>{
    typingDiv.innerText=`${data.username} is typing....`

    //Dbouncing function
    dedounce(function(){
        typingDiv.innerText=""
    },1000)
    
})

//event listener on textarea
textarea.addEventListener('keyup',()=>{
    socket.emit('typing',{username:username})
})

//Api calls

function syncWithDb(data){
    const headers={
        'Content-Type':'application/json'
    }
    fetch('/api/comments',{method:'Post',body: JSON.stringify(data),headers})
    .then((response)=>response.json())
    .then(result=>{
        // console.log(result)
    })
}

function fetchComments(){
    fetch("/api/comments")
    .then(res=>res.json())
    .then(result=>{
        result.forEach((comment)=>{
            comment.time=comment.createdAt
            appendToDom(comment)
        })
        // console.log(result)
    })
}

window.onload=fetchComments