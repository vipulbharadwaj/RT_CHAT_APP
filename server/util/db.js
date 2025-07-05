const mongoose = require("mongoose");


const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to Database");
    } catch (error) {
        console.log("error connceting to database", error);
        process.exit(0);
    }

}
module.exports = connectDB;
