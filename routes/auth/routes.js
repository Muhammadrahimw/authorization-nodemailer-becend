import {Router} from "express";
import {
	changePassword,
	loginController,
	registerController,
	resetPassword,
} from "../../controller/users.controller.js";

const router = Router();

router.post(`/auth/sign-up`, registerController);
router.post(`/auth/sign-in`, loginController);
router.post(`/auth/reset-password`, resetPassword);
router.post(`/auth/change-password`, changePassword);

export {router};
