const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require('../Models/listing.js');
const mongoURL='mongodb://127.0.0.1:27017/wanderlust'
main().then(()=>{
    console.log('connected to db');
})
.catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(mongoURL);
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'665ddada4e9b45fbda2239b6'}))
    await Listing.insertMany(initData.data);
    console.log('data was initialized');
};
initDB();