import fs from "fs";
import path from "path";

export const write = (dir, data) => {
	fs.writeFileSync(
		path.resolve(".", "database", `${dir}.json`),
		JSON.stringify(data, null, 4)
	);
};

export const read = (dir) => {
	return JSON.parse(
		fs.readFileSync(path.resolve(".", "database", `${dir}.json`))
	);
};
