import mongoose  from 'mongoose'

const noteschema=new mongoose.Schema({
   user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
   title:{
    type:String,
    required:true
   } ,
   content:{
    type:String,
    required:true

   }
},{timestamps:true});

export default mongoose.model("note",noteschema)