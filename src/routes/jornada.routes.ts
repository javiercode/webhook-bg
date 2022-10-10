import {Router} from 'express';
import {getEstado,marcar,desactivar,test,findId} from '../controllers/jornada.controller';
import multer from 'multer';
import { TokenMiddleware } from '../configs/TokenMiddleware';
const upload = multer({dest:'/upload'});

const router = Router ();
router.get('/jornada/test',(req, res)=>{ return res.status(501).send("TEST")});
router.get('/jornada/estado',getEstado);
router.post('/jornada/marcar',marcar);
router.get('/jornada/find/:id',findId);
router.delete('/jornada/delete/:id',desactivar);

router.use(TokenMiddleware)
export default router;