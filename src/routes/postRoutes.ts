import express from 'express';
import { PostController } from '../controllers/post.controller';
// import { authenticateToken } from '../middlewares/auth';
import { validatePost } from '../middlewares/validation.middleware';

const router = express.Router();
const postController = new PostController();

router.get('/posts', postController.getPosts);
router.post('/posts',  validatePost, postController.createPost);
router.delete('/posts/:id',  postController.deletePost);

export default router;