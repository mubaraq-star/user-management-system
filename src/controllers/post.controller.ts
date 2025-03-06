import { Request, Response, NextFunction} from 'express';
import db from '../db/knex';
import { NotFoundError, ValidationError } from '../utils/errorHandler';

export class PostController {
  async getPosts(req: Request, res: Response, next:NextFunction) {
    try {
      if (!req.query.userId) {
        return next (new ValidationError('userId query parameter is required'));
      }

      const posts = await db('posts')
        .where({ user_id: req.query.userId });
      
      res.status(200).json(posts);
    } catch (error) {
     next(error)
      }
      
    }
  

  async createPost(req: Request, res: Response, next:NextFunction) {
    try {
      const { user_id, title, body } = req.body;
      const [id] = await db('posts').insert({
        user_id,
      title,
      body,
       created_at: new Date().toISOString()
      });

      res.status(201).json({ id, message: 'Post created successfully' });
    } catch (error) {
    next(error)
    }
  }

  async deletePost(req: Request, res: Response, next:NextFunction) {
    try {
      const deleted = await db('posts')
        .where({ id: req.params.id })
        .delete();

      if (!deleted) {
        return next (new NotFoundError('Post not found'));
      }
      res.status(204).send();
    } catch (error) {
     next(error)
    }
  }
}