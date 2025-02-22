import {Router} from "express";
import {
	deleteById,
	getAll,
	getById,
	post,
	put,
} from "../../controller/products.controller.js";
import {verifyToken} from "../../middleware/auth.middleware.js";

const router = Router();

router.get(`/products`, verifyToken, getAll);
router.get(`/products/:id`, verifyToken, getById);
router.post(`/products`, verifyToken, post);
router.put(`/products/:id`, verifyToken, put);
router.delete(`/products/:id`, verifyToken, deleteById);

export {router};
