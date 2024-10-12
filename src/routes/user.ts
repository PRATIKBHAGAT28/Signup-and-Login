import { RequestHandler, Router } from 'express';
import controller from "../controllers/user"

const router = Router();

router.get('/profile', <RequestHandler>controller?.profile);

export default router;
