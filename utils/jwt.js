import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const signInJwt = (params) => {
	return jwt.sign(params, process.env.SECRET_KEY, {expiresIn: "60m"});
};
