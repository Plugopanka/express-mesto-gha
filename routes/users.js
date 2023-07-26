const router = require('express').Router();
const {
  getUsers, getUser, getUserId, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
// router.post('/', createUser);
router.get('/me', getUser);
router.patch('/me', changeUserInfo);
router.get('/:userId', getUserId);
router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
