import express from 'express';

import Logger from 'common-logs';

import NewOrder from './NewOrder';
import GenerateAllReports from './GenerateAllReports';

const PORT = 3000;

const app = express();

const logger = new Logger();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const newOrder = new NewOrder();
const generateAllReports = new GenerateAllReports();

app.post('/newOrder', newOrder.create.bind(newOrder));
app.get(
  '/admin/generateReports',
  generateAllReports.create.bind(generateAllReports),
);

app.listen(PORT, () => logger.log(`Server running in port ${PORT}`, 'info'));
