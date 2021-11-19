const User = require('../models/User');
const {
  DataError,
  NotFoundError,
  serviceError,
} = require('../utils/Errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send({ data: newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные: ${err.message}` });
      }
      return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message });
    });
};

const getAllUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(serviceError.statusCode).send({ message: serviceError.message + err.message }));
};

const getUserById = async (req, res) => {
  try { // в ревью вы написали что нужно обработать случай, когда дан неверный _id c кодом 400.
    const { userId } = req.params; // но в описании написано что нужно обработать случаи с кодами 404 и 500.
    const userById = await User.findById(userId);
    if (userById) {
      return res.status(200).send({ data: userById });
    }
    throw new NotFoundError(`Пользователь с идентификатором ${userId} не был найден в базе.`);
  } catch (err) {
    if (err instanceof NotFoundError) { // на случай если пользователь с _id не найден. 404
      return res.status(err.statusCode).send({ message: err.message });
    }
    return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message }); // 500
  }
};

const updateUserData = async (req, res) => {
  try {
    const { name, about } = req.body;
    const isNameValid = (name.length >= 2 && name.length <= 30);
    const isAboutValid = (about.length >= 2 && about.length <= 30);
    if (!isNameValid || !isAboutValid) {
      throw new DataError('Некорректные данные. Попробуйте еще раз.');
    }
    const userById = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    if (userById) {
      return res.status(200).send({ data: userById });
    }
    throw new NotFoundError(`Пользователь с идентификатором ${req.user._id} не был найден и как результат не был обновлен.`);
  } catch (err) {
    if (err instanceof DataError) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (avatar.length < 8) {
      throw new DataError('Введите URL по типу https://...');
    }
    const userById = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    if (userById) {
      return res.status(200).send({ data: userById });
    }
    throw new NotFoundError(`Пользователь с идентификатором ${req.user._id} не был найден и как результат не был обновлен.`);
  } catch (err) {
    if (err instanceof DataError) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    if (err instanceof NotFoundError) {
      return res.status(err.statusCode).send({ message: err.message });
    }
    return res.status(serviceError.statusCode).send({ message: serviceError.message + err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
};
