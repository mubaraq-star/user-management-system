import express from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUser } from  '../middlewares/validation.middleware';

const router = express.Router();
const userController = new UserController();

router.get('/users', userController.getAllUsers.bind(userController));
router.get('/users/count', userController.getUserCount.bind(userController));
router.get('/users/:id',  userController.getUserById.bind(userController));
router.post('/users/:id', validateUser, userController.createUser.bind(userController));

export default router;