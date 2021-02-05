const router = require("express").Router();
const categoryControl = require("../controllers/categoryControl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin")

router.route('/category')
  .get(categoryControl.getCategories)
  .post(auth, authAdmin, categoryControl.createCategory)

router.route('/category/:id')
  .delete(auth,authAdmin, categoryControl.deleteCategory)
  .put(auth,authAdmin, categoryControl.updateCategory)


module.exports = router