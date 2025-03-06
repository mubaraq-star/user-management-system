import express from 'express';
import { AddressController } from '../controllers/address.controller';
// import { authenticateToken } from '../middlewares/auth';
import { validateAddress } from '../middlewares/validation.middleware';

const router = express.Router();
const addressController = new AddressController();

router.get('/addresses/:userID', addressController.getAddress.bind(addressController)); 
router.post('/addresses', validateAddress, addressController.createAddress.bind(addressController));
router.patch('/addresses/:userID', validateAddress, addressController.updateAddress.bind(addressController));



export default router;