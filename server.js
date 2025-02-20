import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "muqalla21@gmail.com",
		pass: "xpvz blyf iisa fyhw",
	},
});

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
	console.log(`server started in http://localhost:${PORT}`);
});
