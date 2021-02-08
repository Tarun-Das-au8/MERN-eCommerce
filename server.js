require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 9800;

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true
}));

//connect to mongodb
const URI = process.env.MONGODB_URI;
mongoose.connect(URI, {
  useCreateIndex:true,
  useFindAndModify:false,
  useNewUrlParser:true,
  useUnifiedTopology:true 
},(err)=>{
  if(err) throw err;
  console.log('Connected to MongoDB');
});

//Routes
app.use('/user',require('./routes/userRouter'));
app.use('/api',require('./routes/categoryRouter'));
app.use('/api',require('./routes/upload'));
app.use('/api',require('./routes/productRouter'));
app.use('/api',require('./routes/paymentRouter'));

//health check
app.get('/health',(req,res)=>{
  res.json({msg:"Server is running properly"});
});

app.listen(port,(err)=>{
  if(err) throw err;
  console.log(`Server is running on PORT ${port}`);
});