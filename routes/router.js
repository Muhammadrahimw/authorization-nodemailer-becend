import {Router} from "express";
import {router as authRouter} from "./auth/routes.js";
import {router as productsRouter} from "./products/router.js";

const router = Router();

router.use(productsRouter);
router.use(authRouter);

export {router};
