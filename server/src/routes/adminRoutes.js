const express = require("express");
const { signupAdmin, loginAdmin, addUser, getAllUsersWithAdminId } = require("../controllers/adminController");
const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/login", loginAdmin);

router.post("/add-user", addUser);
router.get("/get-all-users", getAllUsersWithAdminId);

module.exports = router;
