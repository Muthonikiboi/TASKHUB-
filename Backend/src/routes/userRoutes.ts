import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userControllers';
import { protect } from '../middlewares/AuthMiddlewares';
import { forgotPassword, resetPassword } from '../controllers/forgotPasswordController';
import { forgotPasswordValidator, resetPasswordValidator } from '../validators/forgotPasswordValidator'


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/", protect, adminOnly, getAllUsers);
// router.delete("/:userId", protect, adminOnly, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/reset-password/:resetToken", resetPasswordValidator, resetPassword);

export default router;
