const router = require('express').Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUserData);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
