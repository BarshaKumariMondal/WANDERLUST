const mongoose=require("mongoose");
const datainit=require("./data")
const Listing=require("../models/listing");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then((res)=>{
    console.log("connectio successful with db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_url);
}

let initdb=async ()=>{
    await Listing.deleteMany({});
    datainit.data=datainit.data.map((obj)=>({...obj,owner:"66a76995662fd232e1162656"}));
    await Listing.insertMany(datainit.data);
    console.log("data was initialised");
};
initdb();
