import {Router} from 'express';
import {login, logout} from '../controllers/login.controller';

const router = Router ();
router.post('/login',login);

export default router;