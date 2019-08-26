import supertest from 'supertest';
import app from '../../app';
import should from 'should';
import mongoose from 'mongoose';
import stateModel from '../models/stateModel';

const server = supertest(app);
let firstSampleLgaId, firstSampleStateId, secondSampleStateId,
thirdStateSampleId, fourthSampleStateId, createdLgas, createdStates, fourthStateFirstLgaId, firstStateSecondLgaId, thirdStateFirstLgaSampleId,
fifthStateSampleId, fifthStateFirstSampleId;

before(async () => {
  let states = [
    {
      name: 'imo',
      lgas: [
        {
          name: 'orlu',
          males: 3,
          females: 4,
        }
      ],
    },
    {
      name: 'rivers',
      lgas: [
        {
          name: 'warri',
          males: 2,
          females: 3,
        }
      ]
    },
    {
      name: 'abia',
      lgas: [
        {
          name: 'aba',
          males: 2,
          females: 3,
        }
      ]
    },
    {
      name: 'edo',
      lgas: [
        {
          name: 'esan',
          males: 2,
          females: 3,
        }
      ]
    },
    {
      name: 'lagos',
      lgas: [
        {
          name: 'surulere',
          males: 21,
          females: 33,
        }
      ],
    },
  ]

  let lgas = [
    {
      name: 'oru east',
      males: 14,
      females: 23,
    },
    {
      name: 'oru west',
      males: 8,
      females: 10
    }
  ];

  await mongoose.connection.dropDatabase();
  createdStates = await stateModel.insertMany(states);

  firstSampleStateId = createdStates[0]._id;
  secondSampleStateId = createdStates[1]._id;
  thirdStateFirstLgaSampleId = createdStates[2].lgas[0].id
  thirdStateSampleId = createdStates[2]._id;
  fourthSampleStateId = createdStates[3]._id
  fifthStateSampleId = createdStates[4]._id;
  fifthStateFirstSampleId = createdStates[4].lgas[0]._id;
  createdLgas = await createdStates[0].lgas.push(lgas);
  
  firstStateSecondLgaId = createdStates[0].lgas[1]._id
  firstSampleLgaId = createdStates[0].lgas[0]._id;
  fourthStateFirstLgaId = createdStates[3].lgas[0]._id
})

describe('State Model', async () => {
  it('displays a response message at the API root', async () => {
    const res = await server
      .get('/')
      
    res.body.message.should.equal('The route you requested was not found');
  })

  it('creates a new state', async () => {
    const res = await server
      .post('/api/v1/state')
      .send({
        name: 'oyo',
        lgas: [
          {
            name: 'osogbo',
            males: 5,
            females: 4,
          }
        ],
        total: 0
      })

    res.status.should.equal(201);
    res.body.status.should.equal('success')
    res.body.state.name.should.equal('oyo')

    res.body.state.lgas[0].males.should.equal(5)
    res.body.state.lgas[0].females.should.equal(4)
    res.body.state.lgas[0].total.should.equal(9)
  })

  it('prevents creating a state if the name is not provided', async () => {
    const res = await server
      .post('/api/v1/state')
      .send({})

      res.status.should.equal(400)
      res.body.status.should.equal('failed')
      res.body.message.should.equal('Please enter the state name')
  })

  it('prevents creating a state if the name already exists', async () => {
    const res = await server
      .post('/api/v1/state')
      .send({ name: 'imo', males: 40, females: 45 });

      res.status.should.equal(400)
      res.body.status.should.equal('failed')
      res.body.message.should.equal('Another state exists with the same name')
  })

  it('prevents creating an lga if the name is not provided', async () => {
    const res = await server
      .post(`/api/v1/state/${firstSampleStateId}/lga`)
      .send({})

      res.status.should.equal(400);
      res.body.status.should.equal('failed');
      res.body.message.should.equal('Please enter the local govt. area name');
  });

  it('prevents creating an lga if the number of females is not provided', async () => {
    const res = await server
      .post(`/api/v1/state/${firstSampleStateId}/lga`)
      .send({ name: 'hello lga' })

      res.status.should.equal(400);
      res.body.status.should.equal('failed');
      res.body.message.should.equal('Please enter the no. of males');
  });

  it('prevents creating an lga if the number of females is not provided', async () => {
    const res = await server
      .post(`/api/v1/state/${firstSampleStateId}/lga`)
      .send({ name: 'hello lga', males: 40 });

      res.status.should.equal(400);
      res.body.status.should.equal('failed')
      res.body.message.should.equal('Please enter the no. of females');
  });

  it('prevents updating an lga if no update values are passed', async () => {
    const res = await server
      .put(`/api/v1/state/${fourthSampleStateId}/lga/${fourthStateFirstLgaId}`)
      .send({});

      res.body.status.should.equal('failed');
      res.body.message.should.equal('Please enter a field to update');
  })

  it('deletes an lga', async () => {
    const res = await server
      .delete(`/api/v1/state/${fourthSampleStateId}/lga/${fourthStateFirstLgaId}`);

    res.status.should.equal(200);
    res.body.status.should.equal('success');
    res.body.message.should.equal('deleted!')
  });

  it('updates an lga', async () => {
    const res = await server
      .put(`/api/v1/state/${fifthStateSampleId}/lga/${fifthStateFirstSampleId}`)
      .send({ name: 'ebonyi', males: 14, females: 50 });

      res.status.should.equal(200);
      res.body.status.should.equal('success');
      res.body.lga.name.should.equal('ebonyi');
      res.body.lga.males.should.equal(14);
      res.body.lga.females.should.equal(50);
  });

  it('prevents retrieving a state if id provided is invalid', async () => {
    const res = await server
      .get('/api/v1/state/5ccc4347fd82182f2f47d0ay')

    res.status.should.equal(400);
    res.body.status.should.equal('failed');
    res.body.message.should.equal('state(id) isn\'t a valid mongoose document id');
  });

  it('prevents retrieving a state if id is not found', async () => {
    const res = await server
      .get('/api/v1/state/5c75e2f04c1d4bdd506f7cf0')

    res.status.should.equal(404)
    res.body.status.should.equal('failed');
    res.body.message.should.equal('state(id) not found');
  });

  it('creates a new lga in a state', async () => {
    const res = await server
      .post(`/api/v1/state/${firstSampleStateId}/lga`)
      .send({
        name: 'ogbomoso',
        males: 15,
        females: 20
      })

    res.status.should.equal(201);
    res.body.status.should.equal('success');
  });

  it('retrieves a state', async () => {
    const res = await server
      .get(`/api/v1/state/${firstSampleStateId}`)

    res.status.should.equal(200);
    res.body.status.should.equal('success');
    res.body.state.name.should.equal('imo');
  });

  it('retrieves an lga', async () => {
    const res = await server
      .get(`/api/v1/state/${firstSampleStateId}/lga/${firstSampleLgaId}`);

    res.status.should.equal(200);
    res.body.status.should.equal('success');
    res.body.lga.name.should.equal('orlu');
  });

  it('sends an error if the document id isn\'t found ', async () => {
    const res = await server
      .get(`/api/v1/state/${firstSampleStateId}/lga/5ccf98a7bc2de8347fc6bb3w`);

    res.status.should.equal(404);
    res.body.status.should.equal('failed');
    res.body.message.should.equal('lga(id) not found within provided state');
  });

  it('retrieves all states', async () => {
    const res = await server
      .get('/api/v1/states');

    res.status.should.equal(200);
    res.body.status.should.equal('success');
  });

  it('returns the original state if no update values are passed', async () => {
    const res = await server
      .put(`/api/v1/state/${firstSampleStateId}`)
      .send({});

    res.status.should.equal(200);
    res.body.status.should.equal('failed');
    res.body.state.name.should.equal('imo');
    res.body.message.should.equal('Please enter the state name');
  });

  it('updates a state', async () => {
    const res = await server
      .put(`/api/v1/state/${firstSampleStateId}`)
      .send({ name: 'okoro' });

    res.status.should.equal(200);
    res.body.status.should.equal('success');
    res.body.state.name.should.equal('okoro');
  });

  it('deletes a state', async () => {
    const res = await server
      .delete(`/api/v1/state/${secondSampleStateId}`);

    res.status.should.equal(200);
    res.body.status.should.equal('success');
    res.body.message.should.equal('deleted!')
  });
})
