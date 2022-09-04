import { Request, Response } from "express";
import Card from "../models/cards";

export const createCard = (req: any, res: Response) =>
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => {
      if (!card) {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res.send(card);
      }
    })
    .catch((err) => res.status(500).send(err));

export const getCards = (req: Request, res: Response) =>
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(400).send(err));

export const deleteCards = (req: Request, res: Response) =>
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: "Карточка с указанным _id не найдена",
        });
      } else {
        res.send({ message: "Карточка удалена" });
      }
    })
    .catch((err) => res.status(500).send(err));

export const likeCard = (req: any, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: "Передан несуществующий _id карточки",
        });
      } else {
        res.send(card);
      }
    })
    .catch((err) => res.status(400).send(err));

export const dislikeCard = (req: any, res: Response) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: "Передан несуществующий _id карточки",
        });
      } else {
        res.send(card);
      }
    })
    .catch((err) => res.status(500).send(err));
