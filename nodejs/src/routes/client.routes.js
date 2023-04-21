import { Router } from 'express';
import { createClient, deleteClient, getClients, updateClient} from '../controllers/client.controller.js';
import { check } from 'express-validator';
import validateFields from '../middlewares/validateFields.js';


const clientRouter = Router();
clientRouter.put('/', [
    check('name').not().isEmpty(),
    validateFields
], createClient);

clientRouter.get('/', getClients);

clientRouter.put('/:id', [
    check('name').not().isEmpty(),
    validateFields
], updateClient);

clientRouter.delete('/:id', deleteClient);

export default clientRouter;