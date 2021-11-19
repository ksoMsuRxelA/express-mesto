const router = require('express').Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

router.post('/users', createUser);

router.get('/users', getAllUsers);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUserData);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
