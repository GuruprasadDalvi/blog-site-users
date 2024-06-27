const zod = require("zod");

const UserCreationRequest = zod.object({
  username: zod.string().min(3).max(20),
  email: zod.string().email(),
  password: zod.string().min(6).max(100),
});

const UserLoginRequest = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6).max(100),
});

module.exports = {
  UserCreationRequest,
  UserLoginRequest,
};
