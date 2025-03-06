import { Request, Response , NextFunction} from 'express';
import db from '../db/knex';
import { NotFoundError } from '../utils/errorHandler';

export class UserController {
  async getAllUsers(req: Request, res: Response , next:NextFunction) {
    try {
      const pageNumber = parseInt(req.query.pageNumber as string) || 0;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const users = await db('users')
        .limit(pageSize)
        .offset(pageNumber * pageSize);
      res.status(200).json(users);
    } catch (error) {
  
      next(error)
    }
  }

  async getUserCount(req: Request, res: Response , next:NextFunction) {
    try {
      
      const count = await db('users').count('id as total');
      res.status(200).json(count[0]);
    } catch (error) {
         next(error);
    }
  }

  async getUserById(req: Request, res: Response, next:NextFunction) {
    try {
      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        return next(new NotFoundError('Invalid user ID'));
      }
      const user = await db('users').where({ id: req.params.id }).first();
      if (!user) return next(new NotFoundError('User not found'));
      const address = await db('addresses').where({ user_id: req.params.id }).first();
      res.status(200).json({ ...user, address });
    } catch (error) {
            next(error);
    }
  }

  async createUser(req: Request, res: Response, next:NextFunction) {
    try {
      const { name, email, password } = req.body;
      const [id] = await db('users').insert({
        name,
        email,
        password, 
        created_at: new Date().toISOString()
      });
      res.status(201).json({ id, message: 'User created successfully' });
    } catch (error) {
      // if (error instanceof Error) throw error;
      // throw new Error('Error creating user');
      next(error);
    }
  }
}