const Users = require('../models/userModel');
const Payments = require('../models/paymentModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userControl = {
  register: async (req,res)=>{
    try {
      const {name,email,password} = req.body;

      const user = await Users.findOne({email});
      if(user){
        return res.status(400).json({msg:"Email is already exists"})
      }
      if(password.length < 6){
        return res.status(400).json({msg:"Password is atleast 6 charecters long."})
      }

      //password encryption
      const passwordHash = await bcrypt.hash(password,10);
      const newUser = new Users({
        name,email,password: passwordHash
      })

      //save mongodb
      await newUser.save(); 
      //creating jsonwebtoken to authenticaton
      const accesstoken = createAccessToken({id: newUser._id});
      const refreshtoken = createRefreshToken({id: newUser._id});

      res.cookie('refreshtoken',refreshtoken,{
        httpOnly:true,
        path: '/user/refresh_token'
      })

      res.json({accesstoken});
      //res.json({msg:"Register Success!"})

    } catch (err) {
      return res.status(500).json({msg:err.message})
    }
  },
  login: async(req,res)=>{
    try {
      const {email,password} = req.body;
      const user = await Users.findOne({email})
      if(!user){
        return res.status(400).json({msg: 'User does not exist.'})
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){
        return res.status(400).json({msg:"Incorrect password."})
      }
      //if login success, create accesstoken and refreshtoken
      const accesstoken = createAccessToken({id: user._id});
      const refreshtoken = createRefreshToken({id: user._id});

      res.cookie('refreshtoken',refreshtoken,{
        httpOnly:true,
        path: '/user/refresh_token'
      })

      res.json({accesstoken})
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },
  logout: async(req,res)=>{
    try {
      res.clearCookie('refreshtoken',{path: '/user/refresh_token'})
      return res.json({msg:"Logged out"})      
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },
  refreshToken: (req,res)=>{
    try {
      const rf_token = req.cookies.refreshtoken;
      if(!rf_token) {
        return res.status(400).json({msg: "Please Login or Register"})
      }  
      jwt.verify(rf_token, 'TaRuNdAs', (err, user) =>{
          if(err) return res.status(400).json({msg: "Please Login or Register"})
          const accesstoken = createAccessToken({id: user.id})
          res.json({accesstoken})
      })
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },
  getUser: async (req,res)=>{
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if(!user){
        return res.status(400).json({msg: "User does not exists."})
      }
      res.json(user);
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  },
  addCart: async(req,res)=>{
    try{
      const user = await Users.findById(req.user.id)
      if(!user){
        return res.status(400).json({msg: "User does not exist."})
      }

      await Users.findOneAndUpdate({_id: req.user.id},{
        cart: req.body.cart
      })

      return res.json({msg: "Added to cart"})
    }catch(err){
      return res.status(500).json({msg: err.message})
    }
  },
  history: async(req,res)=>{
    try {
      const history = await Payments.find({user_id: req.user.id})

      res.json(history);
    } catch (err) {
      return res.status(500).json({msg: err.message});
    }
  }
}

const createAccessToken = (user)=>{
  return jwt.sign(user,'jwt token',{expiresIn: '1d'});
}
const createRefreshToken = (user)=>{
  return jwt.sign(user,'TaRuNdAs',{expiresIn: '7d'});
}
module.exports = userControl;