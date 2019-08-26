import controllers from '../controllers';

const stateController = controllers.state;

const router = app => {

  // route that creates a new state with/without lgas
  app.post('/api/v1/state', stateController.createState);

  // route that creates a new lga in a state
  app.post('/api/v1/state/:stateId/lga', stateController.addLga);

  // route that retrieves a state
  app.get('/api/v1/state/:stateId', stateController.getState);

  // route that retrieves an lga
  app.get('/api/v1/state/:stateId/lga/:lgaId', stateController.getLga);

  // route that retrieves all states
  app.get('/api/v1/states', stateController.getStates);
  
  // route that deletes a state
  app.delete('/api/v1/state/:stateId', stateController.deleteState);

  // route that deletes an lga
  app.delete('/api/v1/state/:stateId/lga/:lgaId', stateController.deleteLga);

  // route that updates a state
  app.put('/api/v1/state/:stateId', stateController.updateState);

  // route that updates an lga
  app.put('/api/v1/state/:stateId/lga/:lgaId', stateController.updateLga);

}

export default router;
