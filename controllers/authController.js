import { StatusCodes } from 'http-status-codes';
import { BadRequestError,NotFoundError,UnauthenticatedError } from "../errors/index.js";
import User from '../models/User.js'

const register = async (req,res) => {
    const {name,email,password} = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError('please provide all values');
    }

    const emailAlreadyExsist = await User.findOne({email});
    if (emailAlreadyExsist) {
        throw new BadRequestError('Email already in use');
    }
    const user = await User.create({name,email,password});
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user,token});
}

const login = async (req,res) => {
    const {email,password} = req.body;
    if (!email || !password) {
        throw new BadRequestError('please provide all values');
    }

    const user = await User.findOne({email}).select('+password');
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()
    user.password = undefined
    res.status(StatusCodes.OK).json({user,token,location:user.location});
}

const updateUser = async (req,res) => {
    try {
        // console.log(req.user);
        const { email, name, lastName, location } = req.body;
        if (!email || !name || !lastName || !location) {
            throw new BadRequestError('Please provide all values')
        }

        const user = await User.findById({ _id: req.user.userId })
        user.email = email
        user.name = name
        user.lastName = lastName
        user.location = location

        await user.save()

        const token = user.createJWT()
        res.status(StatusCodes.OK).json({
            user,
            token,
            location: user.location
        })
    } catch (e) {
        console.log(e);
    }
}

export { register, login, updateUser }