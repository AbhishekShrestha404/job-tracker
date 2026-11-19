import { Router } from 'express';
import {
    getApplications,
    getApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    reorderApplications,
} from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // every route below requires a valid token

router.patch('/reorder', reorderApplications);

router.route('/').get(getApplications).post(createApplication);

router
    .route('/:id')
    .get(getApplication)
    .patch(updateApplication)
    .delete(deleteApplication);

export default router;