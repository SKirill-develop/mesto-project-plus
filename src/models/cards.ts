import mongoose from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: [mongoose.Types.ObjectId];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Ссылка на картинку не прошла валидацию.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('Card', cardSchema);
