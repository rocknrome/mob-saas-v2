import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send('Clients API');
});

export default router;
