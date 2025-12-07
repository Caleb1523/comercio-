import mongoose from "mongoose";

const productShema =new mongoose.Schema({
    productID:{type:String,required:true,unique:true},
    nombre:{type:String,required:true},
    descripcion:{type:String,required:true},
    precio:{type:Number,required:true},
    image:{type:String,required:true},
});
//forzamos para que se guarde en la colección productos
const product=mongoose.model("productos",productShema,"productos");

export default product;