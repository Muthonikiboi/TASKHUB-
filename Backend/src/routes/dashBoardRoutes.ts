// routes.ts (or wherever you define your routes)
import express from 'express';
import { protect, restrictTo  } from '../middlewares/AuthMiddlewares';
import { adminDashboard, userDashboard } from '../controllers/dashBoardControllers';

const router = express.Router();



// // Admin Dashboard Route
// router.get('/dashboard/admin', protect, adminOnly, (req: CustomRequest, res) => {
//     // Render the admin dashboard
//     res.status(200).json({
//         message: 'Welcome to the admin dashboard',
//         user: req.user, // Include user information if needed
//     });
// });


router.get('/dashboard/admin', protect, restrictTo('admin'), adminDashboard);

// // Regular User Dashboard Route
// router.get('/dashboard/user', protect, regularUserOnly, (req, res) => {
//     // Render the regular user dashboard
//     res.status(200).json({
//         message: 'Welcome to your dashboard',
//         user: req.user, // Include user information if needed
//     });
// });

router.get('/dashboard/user', protect, userDashboard);

export default router;
