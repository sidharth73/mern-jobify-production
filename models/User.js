import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 20,
        default: 'lastname'
    },
    location: {
        type: String,
        required: true,
        maxlength: 20,
        default: 'my city'
    }
});

userSchema.pre('save',async function () {
    // console.log(this.modifiedPaths());
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hashSync(this.password,salt);
})

userSchema.methods.createJWT = function(){
    return jwt.sign(
        {userId:this._id},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME })
}

userSchema.methods.comparePassword = async function(cPassword){
    const isMatch = await bcrypt.compare(cPassword,this.password);
    return isMatch;
}
export default mongoose.model('User',userSchema);