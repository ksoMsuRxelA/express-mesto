const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  getAllCards,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().uri(),
  }),
}), createCard);

// В остальных роутах нечего валидировать, у них только cardId
router.get('/cards', getAllCards);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', putLike);

router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
