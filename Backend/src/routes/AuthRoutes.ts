import { Router } from 'express';
import { registerUser, loginUser, getAllUsers, deleteUserById } from '../controllers/AuthControllers';
import { protect, restrictTo } from '../middlewares/AuthMiddlewares';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/").get(protect, restrictTo('admin'),getAllUsers);
router.delete("/:id",protect, restrictTo('admin'),deleteUserById);

export default router;
