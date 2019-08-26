import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import { isEmpty } from '../utils';

export const lgaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the local govt. area name'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: props => {
        return `input is not a valid ${props.path}`
      }
    },
    unique: 'LGA name already in use'
  },
  males: {
    type: Number,
    required: [true, 'Please enter the no. of males'],
  },
  females: {
    type: Number,
    required: [true, 'Please enter the no. of females'],
  },
  total: {
    type: Number,
  },
})

lgaSchema.pre('save', function(next) {
  const lgaPopulationTotal = this.males + this.females;
  this.total = lgaPopulationTotal;
  next();
})

lgaSchema.plugin(beautifyUnique);

export default mongoose.model('Lga', lgaSchema);
