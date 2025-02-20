import {transport} from "../config/mailer.js";
import {read, write} from "../utils/fs.js";
import {signInJwt} from "../utils/jwt.js";
import {CustomError, ResData} from "../utils/response-helpers.js";
import {totp} from "otplib";
import dotenv from "dotenv";
dotenv.config();

totp.options = {step: 60};

export const loginController = async (req, res, next) => {
	try {
		const {email, password} = req.body;
		if (!email || !password)
			throw new CustomError(400, `Email or password must be`);
		const findUser = read(`users`).find(
			(user) => user.email === email && user.password === password
		);
		if (!findUser) throw new CustomError(400, `Email or password wrong`);
		const token = signInJwt({id: findUser.id});
		const resData = new ResData(200, `success`, [{...findUser, token}]);
		await transport.sendMail({
			from: process.env.MAIL_AUTH_NAME,
			to: findUser.email,
			subject: "Login successfully",
			text: `Welcome ${findUser.name}`,
		});
		res.status(resData.status).json(resData);
	} catch (error) {
		next(error);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		const {email} = req.body;
		if (!email) throw new CustomError(400, `Your email not defined`);
		const findUser = read(`users`).find((user) => user.email === email);
		// Aynan secret o'zgaruvchisiga olish majburiy
		const secret = process.env.SECRET_KEY + findUser.email;
		const otpCode = totp.generate(secret);
		await transport.sendMail({
			from: process.env.MAIL_AUTH_NAME,
			to: findUser.email,
			subject: "Password change request",
			html: `
           <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #4CAF50;
                    }
                    .code {
                        font-size: 32px;
                        font-weight: bold;
                        color: #333;
                        margin: 20px 0;
                        padding: 10px;
                        border: 2px dashed #4CAF50;
                        display: inline-block;
                        letter-spacing: 4px;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777;
                    }
                    .footer a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">Your Company</div>
                    <h2>Verify Your Email</h2>
                    <p>Use the code below to verify your email address:</p>
                    <div class="code">${otpCode}</div>
                    <p>If you didn’t request this, please ignore this email.</p>
                    <div class="footer">
                        &copy; 2025 Your Company. All rights reserved. <br>
                        <a href="#">Contact Support</a>
                    </div>
                </div>
            </body>
            </html>
            `,
		});
		res.json({message: "Code sent successfully"});
	} catch (error) {
		next(error);
	}
};

export const changePassword = (req, res, next) => {
	try {
		const {code, email, newPassword} = req.body;
		// Aynan secret o'zgaruvchisiga olish majburiy
		const secret = process.env.SECRET_KEY + email;
		const isValid = totp.check(code, secret, {window: 1});
		if (!isValid) throw new CustomError(400, `Incorrect code`);
		const users = read(`users`).map((user) =>
			user.email === email ? {...user, password: newPassword} : user
		);
		write(`users`, users);
		const resData = new ResData(200, `Your password successfully changed`);
		res.status(resData.status).json(resData);
	} catch (error) {
		next(error);
	}
};
