import { Request, Response, NextFunction } from 'express';
import db from '../db/knex';
import { NotFoundError, ValidationError } from '../utils/errorHandler';
export class AddressController {
    async getAddress(req: Request, res: Response,  next: NextFunction  ) {
      try {
        // const { userID } = req.params;
        const address = await db('addresses')
          .where({ user_id: req.params.userID })
          .first();
        
          if (!address) {
            return next(new NotFoundError('Address not found'));
          }
        
        res.status(200).json(address);
      } catch (error) {
        console.log('Error in getAddress:', error);
                next(error)
      }
    }
  
  

    async createAddress(req: Request, res: Response ,  next: NextFunction ) {
      try {
        const existingAddress = await db('addresses')
          .where({ user_id: req.body.user_id })
          .first();
        
        if (existingAddress) {
          return next (new ValidationError('User already has an address'));
        }
  
        const [id] = await db('addresses').insert(req.body);
        res.status(201).json({ id, message: 'Address created successfully' });
      } catch (error) {
        next(error)
    }
    }
     async updateAddress(req: Request, res: Response, next:NextFunction) {
      try {
        console.log('updateAddress function called with userID:', req.params.userID);
        const updated = await db('addresses')
          .where({ user_id: req.params.userID })
          .update(req.body);
  
        if (!updated) {
          console.log('Address not found');
          return next(new NotFoundError('Address not found'));
        }
        console.log('Address updated successfully');
        res.status(200).json({ message: 'Address updated successfully' });
      } catch (error) {
        console.error('Error in updateAddress:', error);
        next(error);
      }
    }
  }
     
  
  