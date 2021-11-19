const router = require('express').Router();
const {
  createCard,
  getAllCards,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

router.post('/cards', createCard);

router.get('/cards', getAllCards);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', putLike);

router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
