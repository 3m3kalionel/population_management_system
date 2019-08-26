import stateModel from '../models/stateModel';
import { validateDocument, validateSubDocument , handleError } from '../utils';

export default class State {
  static async createState(req, res) {
    const { name, lgas } = req.body;
    const newState = new stateModel({ name, lgas: [ ...lgas || [] ]})

    newState.save(function(error) {
      error && error.errors
      ? handleError(error, res)
      : res.status(201).send({
        status: 'success',
        state: newState,
      })
    })
  }

  static async addLga (req, res) {
    const { name, males, females } = req.body;
    const { stateId } = req.params;
    const state = await validateDocument(stateModel, stateId, res);

    if (state && !state.statusCode) {
      state['lgas'].push({ name, males, females });
      state.save(function(error) {
        error && error.errors
        ? handleError(error, res)
        : res.status(201).send({
          status: 'success',
        })
      });
    }
  }

  static async getState(req, res) {
    const { stateId } = req.params;    
    const response = await validateDocument(stateModel, stateId, res);
    response && !response.statusCode && res.status(200).send({
      status: 'success',
      state: response,
    })
  }

  static async getStates(req, res) {
    const allStates = await stateModel.find();
    res.status(200).send({
      status: 'success',
      states: allStates,
    })
  }

  static async deleteState(req, res) {
    const { stateId } = req.params;
    const response = await validateDocument(stateModel, stateId, res);
    response && !response.statusCode && response.remove();
    response && !response.statusCode && res.status(200).send({
      status: 'success',
      message: 'deleted!'
    })
  }

  static async deleteLga (req, res) {
    const { lgaId, stateId } = req.params;
    const state = await validateDocument(stateModel, stateId, res);
    const lga = state && !state.statusCode && await validateSubDocument(state, lgaId, res);

    if (lga && !lga.statusCode) {
      state.lgas.id(lgaId).remove();
      state.save();
      return res.status(200).send({
        status: 'success',
        message: 'deleted!',
      })
    }
  }

  static async getLga (req, res) {
    const { lgaId, stateId } = req.params;
    const state = await validateDocument(stateModel, stateId, res);
    const lga = state && !state.statusCode && await validateSubDocument(state, lgaId, res);

    if (lga && !lga.statusCode) {
      res.status(200).send({
        status: 'success',
        lga,
      })
    }
  }

  static async updateLga(req, res) {
    const { lgaId, stateId } = req.params;
    const state = await validateDocument(stateModel, stateId, res);
    const lga = state && !state.statusCode && await validateSubDocument(state, lgaId, res);

    if (!Object.keys(req.body).length) {
      return res.send({
        status: 'failed',
        message: 'Please enter a field to update',
      })
    } else if (lga &&!lga.statusCode) {
      const { name, males, females } = lga;
      
      lga.name = req.body.name || name;
      lga.males = req.body.males || males;
      lga.females = req.body.females || females;
      
      await state.save();
      res.status(200).send({
        status: 'success',
        lga,
      })
    }
  }

  static async updateState(req, res) {
    const { stateId } = req.params;
    const state = await validateDocument(stateModel, stateId, res);

    if (!Object.keys(req.body).length) {
      return res.send({
        status: 'failed',
        message: 'Please enter the state name',
        state,
      })
    } else if (state && !state.statusCode) {
      const { name } = state;

      state.name = req.body.name || name;
      await state.save()
      res.status(200).send({
        status: 'success',
        state,
      })
    }
  }
}
