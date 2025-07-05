const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");


const protectRoute = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;
         if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({success:false, message: "User not found"});

        req.user= user;
        next();

    } catch (error) {
         console.log("Auth Error:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
        
    }
}

module.exports = protectRoute;