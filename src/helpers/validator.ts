import mongoose from 'mongoose';
import NotFoundError from '../errors/not-found-error';

export const method = (value: string) => {
  if (mongoose.isValidObjectId(value)){
    return value;
  } else {
    throw new NotFoundError('Не валидный _id');
  }
};
