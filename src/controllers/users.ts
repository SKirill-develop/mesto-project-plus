import { Request, Response } from "express";
import User from "../models/users";

export const createUser = (req: Request, res: Response) =>
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => {
      if (!user) {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(500).send(err));

export const getUser = (req: any, res: Response) =>
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: "Пользователь по указанному _id не найден",
        });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(500).send(err));

export const getUsers = (req: Request, res: Response) =>
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(400).send(err));

export const updateUser = (req: any, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      upsert: true,
    }
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: "Запрашиваемый пользователь не найден",
        });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(500).send(err));
};

export const updateAvatar = (req: any, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: "Запрашиваемый пользователь не найден",
        });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(500).send(err));
};
