import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// ===== PUBLIC ROUTES (No Auth Required) =====
router.get('/product/:productId', reviewController.getProductReviews);

// ===== PROTECTED ROUTES (Auth Required) =====
router.use(verifyJWT);

// Customer routes
router.post('/', authorizeRoles('customer'), reviewController.createReview);
router.get('/my-reviews', authorizeRoles('customer'), reviewController.getCustomerReviews);
router.get('/reviewable', authorizeRoles('customer'), reviewController.getReviewableProducts);
router.patch('/:reviewId', authorizeRoles('customer'), reviewController.updateReview);
router.delete('/:reviewId', authorizeRoles('customer'), reviewController.deleteReview);
router.post('/:reviewId/helpful', reviewController.markHelpful);

export default router;