import mongoose from 'mongoose';
import NotFoundError from '../errors/not-found-error';

const method = (value: string) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new NotFoundError('Не валидный _id');
  }
  return value;
};
export default method;
