const Category = require("../models/categoryModel")

const categoryControl = {
  getCategories: async (req,res)=>{
    try {
      const categories = await Category.find()
      res.json(categories)
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  createCategory: async (req,res)=>{
    try {
      const {name} = req.body;
      const category = await Category.findOne({name});
      if(category){
        return res.status(400).json({msg:"This category already exists."})
      }
      const newCategory = new Category({name})
      await newCategory.save();
      res.json({msg:"New Category created"});
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  deleteCategory: async (req,res)=>{
    try {
      await Category.findByIdAndDelete(req.params.id)
      res.json({msg:"Category deleted"});
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  },
  updateCategory: async (req,res)=>{
    try {
      const {name} = req.body;
      await Category.findOneAndUpdate({_id:req.params.id},{name})
      res.json({msg:"Category updated"});
    } catch (err) {
      return res.status(500).json({msg:err.message});
    }
  }
}

module.exports = categoryControl;