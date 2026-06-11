import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// All order routes require authentication
router.use(verifyJWT);

// Admin, Vendor, Customer can view orders (filtered by role)
router.get('/', 
  authorizeRoles('admin', 'vendor', 'customer'), 
  orderController.getOrders
);

router.get('/:orderId', 
  authorizeRoles('admin', 'vendor', 'customer'), 
  orderController.getOrder
);

// Only admin and vendor can update order status
router.patch('/:orderId/status', 
  authorizeRoles('admin', 'vendor'), 
  orderController.updateOrderStatus
);

// For testing - create order (normally created after payment)
router.post('/', 
  authorizeRoles('admin', 'customer'), 
  orderController.createOrder
);

export default router;