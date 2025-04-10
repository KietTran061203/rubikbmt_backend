var express = require("express");
var router = express.Router();
var { ObjectId } = require("mongodb");
var Role = require("./../../entities/role");
var RoleService = require("./../../services/roleService");
var UserRole = require("./../../entities/user_role");
var UserRoleService = require("./../../services/userRoleService");
var verifyToken = require("./../../utils/verifyToken");
router.post("/add", verifyToken, async function (req, res) {
  try {
    var permision = req.userData.claims.includes("user-role.add");
    if (!permision) {
      return res
        .status(403)
        .json({ status: false, message: "You do not have permision." });
    }
    var { userId, roleId } = req.body;
    var userRoleService = new UserRoleService();
    var existingUserRole = await userRoleService.getUserRoleByBoth(
      userId,
      roleId
    );
    console.log(existingUserRole);
    if (existingUserRole) {
      return res.status(409).json({
        status: false,
        message: "Role already exists for user",
      });
    }
    var userRole = new UserRole();
    userRole.userId = userId;
    userRole.roleId = roleId;
    var result = await userRoleService.insertUserRole(userRole);
    return res.status(200).json({
      status: true,
      message: "User and Role added successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/update", verifyToken, async function (req, res) {
  try {
    var permision = req.userData.claims.includes("user-role.update");
    if (!permision) {
      return res
        .status(403)
        .json({ status: false, message: "You do not have permision." });
    }
    var { userId, roleId } = req.body;
    var userRoleService = new UserRoleService();
    var id = req.query.id;
    var existingRoleId = await userRoleService.getUserRoleById(id);
    if (!existingRoleId) {
      return res.status(404).json({
        status: false,
        message: "User role not found",
      });
    }
    var existingUserRole = await userRoleService.getUserRoleByBoth(
      userId,
      roleId
    );
    console.log(existingUserRole);
    if (existingUserRole) {
      return res.status(409).json({
        status: false,
        message: "Role already exists for user",
      });
    }
    var userRole = new UserRole();
    (userRole._id = new ObjectId(id)), (userRole.userId = userId);
    userRole.roleId = roleId;
    var result = await userRoleService.updateUserRole(userRole);

    return res.status(200).json({
      status: true,
      message: "User Role updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete", verifyToken, async function (req, res) {
  try {
    var permision = req.userData.claims.includes("user-role.delete");
    if (!permision) {
      return res
        .status(403)
        .json({ status: false, message: "You do not have permision." });
    }
    var id = req.query.id;
    var userRoleService = new UserRoleService();
    let result = await userRoleService.delteUserRole(id);
    return res.status(200).json({
      status: true,
      message: "User role deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
