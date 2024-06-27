const UserServices = require("../service/UserService");
const middleware = require("../middleware/ValidationMiddleware");

const express = require("express");
const router = express.Router();

// create a new user
router.post(
  "/register",
  middleware.UserCreationRequestValidation,
  async (req, res) => {
    try {
      const user = await UserServices.createNewUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// login user
router.post(
  "/login",
  middleware.UserLoginRequestValidation,
  async (req, res) => {
    try {
      const user = await UserServices.loginUser(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// get all users
router.get("/users", async (req, res) => {
  try {
    const users = await UserServices.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// get user by id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await UserServices.getUserDetails(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update user
router.put("/users/:id", middleware.checkAuthorization, async (req, res) => {
  try {
    const user = await UserServices.updateUserPassword(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete user
router.delete("/users/:id", middleware.checkAuthorization, async (req, res) => {
  try {
    const user = await UserServices.deleteUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add bookmark
router.post("/users/:id/bookmark", middleware.checkAuthorization, async (req, res) => {
  try {
    const user = await UserServices.addBookmark(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove bookmark
router.delete("/users/:id/bookmark", middleware.checkAuthorization, async (req, res) => {
  try {
    const user = await UserServices.removeBookmark(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
