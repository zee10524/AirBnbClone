const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("connected to DB");
    
})

const initDB= async()=>{

    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "685675513af08da33d46d1b1"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
    
}

initDB();

