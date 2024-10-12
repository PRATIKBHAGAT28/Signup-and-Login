
import { RequestHandler, Router } from 'express';
import controller from "../controllers/auth"

const router = Router();


router.post('/login', <RequestHandler>controller?.login);
router.post('/signup', <RequestHandler>controller?.signup);

export default router;
