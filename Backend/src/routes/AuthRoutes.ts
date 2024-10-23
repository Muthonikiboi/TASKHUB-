import { Router } from 'express';
import { registerUser, loginUser, getAllUsers, deleteUserById } from '../controllers/AuthControllers';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/").get( getAllUsers);
router.delete("/:userId",deleteUserById);

export default router;
