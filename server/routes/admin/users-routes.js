const express = require("express");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../../controllers/admin/users-controller");

const router = express.Router();

router.get("/get", getAllUsers);
router.put("/role/:id", updateUserRole);
router.delete("/delete/:id", deleteUser);

module.exports = router;