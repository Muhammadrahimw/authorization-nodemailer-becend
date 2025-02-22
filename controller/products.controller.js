import {read, write} from "../utils/fs.js";
import {CustomError, ResData} from "../utils/response-helpers.js";

export const getAll = (req, res, next) => {
	try {
		const products = read(`vehicles`);
		const resData = new ResData(200, `success`, products);
		res.status(resData.status).json(resData);
	} catch (error) {
		next(error);
	}
};

export const getById = (req, res, next) => {
	try {
		const {id} = req.params;
		const products = read(`vehicles`);
		const findProduct = products.find((product) => product.id == id);
		if (!findProduct) throw new CustomError(400, `Product not found`);
		const resData = new ResData(200, `success`, findProduct);
		res.status(resData.status).json(resData);
	} catch (error) {
		next(error);
	}
};

export const post = (req, res, next) => {
	try {
		const {type, brand, model, year} = req.body;
		if (!type || !brand || !model || !year)
			throw new CustomError(400, `type, brand, model, and year are must be`);
		let products = read(`vehicles`);
		products.push({
			id: products.length ? products.length + 1 : 1,
			type: type,
			brand: brand,
			model: model,
			year: year,
		});
		const resData = new ResData(200, `successfully added`, {
			type: type,
			brand: brand,
			model: model,
			year: year,
		});
		write(`vehicles`, products);
		res.status(resData.status).json(resData);
	} catch (error) {
		next(error);
	}
};

export const put = (req, res, next) => {
	try {
		const {id} = req.params;
		const {type, brand, model, year} = req.body;
		if (!type || !brand || !model || !year)
			throw new CustomError(400, `type, brand, model, and year are must be`);
		let products = read(`vehicles`);
		const checkProduct = products.find((product) => product.id == id);
		if (!checkProduct) throw new CustomError(400, `Product not found`);
		products = products.map((product) =>
			product.id == id
				? {
						...product,
						type: type,
						brand: brand,
						model: model,
						year: year,
				  }
				: product
		);
		const resData = new ResData(200, `successfully edited`, {
			type: type,
			brand: brand,
			model: model,
			year: year,
		});
		write(`vehicles`, products);
		res.status(resData.status).json(resData);
	} catch (error) {
		next(error);
	}
};

export const deleteById = (req, res, next) => {
	try {
		const {id} = req.params;
		let products = read(`vehicles`);
		const checkProduct = products.find((product) => product.id == id);
		if (!checkProduct) throw new CustomError(400, `Product not found`);
		products = products.filter((product) => product.id != id);
		write(`vehicles`, products);
		const resData = new ResData(200, `successfully deleted`);
		res.status(resData.status).json(resData);
	} catch (error) {
		next(error);
	}
};
