const mongoose = require("mongoose");

//const uri = "mongodb+srv://thevipulbhardwaj:dnaca6LUpCh51bsu@cluster-chat.qntpvtb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-chat"
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