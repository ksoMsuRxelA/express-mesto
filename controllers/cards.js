const Card = require('../models/Card');
const {
  DataError,
  NotFoundError,
  serviceError,
} = require('../utils/Errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные: ${err.message}` });
      }
      return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message });
    });
};

const getAllCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Somethin wrong with server: ${err.message}` }));
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const cardById = await Card.findByIdAndRemove(cardId);
    if (cardById) {
      return res.status(200).send({ data: cardById });
    }
    throw new NotFoundError(`Карточка с идентификатором ${cardId} не была найдена и не удалена.`);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message });
  }
};

const putLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const unupdatedCard = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } });
    if (!unupdatedCard) {
      throw new NotFoundError(`Не удалось найти карточку с идентификатором ${cardId} чтобы поставить лайк.`);
    }
    if (unupdatedCard.likes.includes(req.user._id)) {
      throw new DataError('Данный пользователь уже ставил лайк этой карточке.');
    } else {
      const updatedCard = await Card.findById(cardId);
      return res.status(200).send({ data: updatedCard });
    }
  } catch (err) { // все случаи ошибок из описания здесь описаны
    if (err instanceof DataError) { // на случай если пользователь уже ставил лайк. 400
      return res.status(err.statusCode).send({ message: err.message });
    }
    if (err instanceof NotFoundError) { // на случай если _id карточки не валидный. 404
      return res.status(err.statusCode).send({ message: err.message });
    }
    return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message }); // 500
  }
};

const removeLike = async (req, res) => {
  try {
    const { cardId } = req.params;
    const unupdatedCard = await Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } });
    if (!unupdatedCard) {
      throw new NotFoundError(`Не удалось найти карточку с идентификатором ${cardId} чтобы снять лайк.`);
    }
    if (!unupdatedCard.likes.includes(req.user._id)) {
      throw new DataError('Данный пользователь не ставил лайк этой карточке.');
    } else {
      const updatedCard = await Card.findById(cardId);
      return res.status(200).send({ data: updatedCard });
    }
  } catch (err) { // все случаи ошибок из описания здесь описаны
    if (err instanceof DataError) { // на случай если пользователь не ставил лайк. 400
      return res.status(err.statusCode).send({ message: err.message });
    }
    if (err instanceof NotFoundError) { // на случай если _idкарточки не валидный. 404
      return res.status(err.statusCode).send({ message: err.message });
    }
    return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message }); // 500
  }
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  putLike,
  removeLike,
};
