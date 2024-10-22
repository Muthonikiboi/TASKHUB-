import { Router } from 'express';
import { registerUser, loginUser, getAllUsers, deleteUser } from '../controllers/AuthControllers';
import { protect, adminOnly } from '../middlewares/authMiddlewares';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/").get( getAllUsers);
router.delete("/:userId",deleteUser);

export default router;
