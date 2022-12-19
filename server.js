const express=require("express");

const app=express();

const port=process.env.PORT || 8000


app.use(express.static("public"));

//db connection
const dbConnect=require("./db")
dbConnect()
const Comment=require("./models/comment")
app.use(express.json())
//Routes
app.post("/api/comments",(req,res)=>{
    const comment=new Comment({
        username:req.body.username,
        comment:req.body.comment
    })

    comment.save().then(response => {
        res.send(response)
    })
})

app.get("/api/comments",(req,res)=>{
    Comment.find().then(comments=>{
        res.send(comments)
    })
})

const server=app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})

let io=require('socket.io')(server);

io.on('connection',(socket)=>{
    console.log(`New connection: ${socket.id}`)
    //receive event
    socket.on('comment',(data)=>{
        // console.log(data);
        data.time=Date()
        socket.broadcast.emit('comment',data);
    })

    socket.on('typing',(data)=>{
        socket.broadcast.emit('typing',data);
    })
})