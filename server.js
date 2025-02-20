import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import {CustomError, ResData} from "./utils/response-helpers.js";
import {router} from "./routes/router.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 6060;

app.use(router);

app.use((req, res, next) => {
	try {
		throw new CustomError(404, `This ${req.url} page not found`);
	} catch (error) {
		next(error);
	}
});

app.use((error, req, res, next) => {
	const statusCode = error.status || 500;
	const resData = new ResData(statusCode, error.message);
	res.status(resData.status).json(resData);
});

app.listen(PORT, () => {
	console.log(`server started in http://localhost:${PORT}`);
});
