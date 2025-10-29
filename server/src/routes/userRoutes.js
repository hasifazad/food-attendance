const express = require("express");
const { loginUser, addOrUpdateFoodStatus, getFoodStatusByUserAndDate } = require("../controllers/userController");
const router = express.Router();


router.post("/login", loginUser);

router.post("/food-status", addOrUpdateFoodStatus);

router.get("/food-status/single", getFoodStatusByUserAndDate);

module.exports = router;
