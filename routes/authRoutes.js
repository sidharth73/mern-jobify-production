import express from "express";
const router = express.Router();
import { register,login,updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";
import rateLimiter from "express-rate-limit";

let apiRateLimiter = rateLimiter({
    windowMs: 15*60*1000, // 15min
    max: 10,
    message: 'Too many requests from this IP address, please try again after 15 minutes'
})
router.route('/register').post(apiRateLimiter, register);
router.route('/login').post(apiRateLimiter, login);
router.route('/updateUser').patch(authenticateUser,updateUser);

export default router;