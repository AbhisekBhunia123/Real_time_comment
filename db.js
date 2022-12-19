
const mongoose=require("mongoose")
function dbConnect(){
    const url='mongodb://localhost/comments';
    mongoose.connect(url).then(()=>console.log("Database connected....")).catch((err)=>console.log("Connection failed....."))
}

module.exports=dbConnect;