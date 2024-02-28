import { Router } from 'express';
import usersRouter from './routes/users.routes';
import authRouter from './routes/auth.routes';


const router = Router();
router.use("/users", usersRouter);
router.use("/auth", authRouter);
//TODO: add more routes

export default router;