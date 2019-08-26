import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import { isEmpty } from '../utils';
import { lgaSchema } from './lgaModel'

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the state name'],
    validate: {
      validator: function(field) {
        return isEmpty(field);
      },
      message: props => {
        return `input is not a valid ${props.path}`
      }
    },
    unique: 'Another state exists with the same name',
  },
  lgas: [lgaSchema],
  males: Number,
  females: Number,
  total: Number,
})

stateSchema.pre('save', function(next) {
  let statePopulationTotal;
  let females;
  let males;

  if (this.lgas.length !== 0) {
    males = this.lgas.reduce((acc, currValue) =>
      acc.males + currValue.males)
  }

  if (this.lgas.length !== 0) {
    females = this.lgas.reduce((acc, currValue) =>
      acc.females + currValue.females)
  }

  if (this.lgas.length !== 0) {
    statePopulationTotal = this.lgas.reduce((acc, currValue) =>
      acc.total + currValue.total)
  }

  this.males = males || 0;
  this.females = females || 0;
  this.total = statePopulationTotal || 0;
  next();
})

stateSchema.plugin(beautifyUnique);


export default mongoose.model('State', stateSchema);
