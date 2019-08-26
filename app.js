import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';

import router from './server/routes';
import connect from './server/connect';

// set up express and the default catch-all route
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router(app)
connect();

app.get('*', (req, res) => res.status(200).send({
  message: 'The route you requested was not found',
}));

// set up the server
const port = parseInt(process.env.PORT, 10) || 6688;
app.set('port', port);
const server = createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});


export default app;
