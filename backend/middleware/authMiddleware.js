import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const protectedRoute = async (req, res, next ) => {
   try {
		const token = req.cookies.jwt

		  //console.log("Request received for protected route.");
        //console.log("Request headers:", req.headers); // Check all headers
        //console.log("Request cookies (raw):", req.headers.cookie); // Raw cookie header
        //console.log("Parsed cookies (req.cookies):", req.cookies); // What cookie-parser gives
		  //console.log("Extracted token:", token);

		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id).select("-password");

		//console.log("Decoded token:", decoded);
		//console.log("User from token:", user);

		if (!user) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		req.user = user;
		next();
      
	} catch (err) {
		console.log("Error in protectRoute middleware", err);
		return res.status(500).json({ err: "Internal Server Error" });
	}
}