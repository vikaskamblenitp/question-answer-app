import { join, extname } from "path";
import multer from "multer";

const storage = multer.diskStorage({
	destination(req, file, callback) {
		switch (file.fieldname) {
			default: {
				callback(null, join(".data", "files"));
				break;
			}
		}
	},
	filename(req, file, callback) {
		callback(null, `${file.fieldname}-${Date.now()}${extname(file.originalname)}`);
	}
});

const memoryStorage = multer.memoryStorage();

export const uploadMiddleware = (fieldName: string) => {
	return multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } }).single(fieldName);
};

export const uploadMultipleMiddleware = (fieldName: string) => {
	return multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } }).array(fieldName);
};

export const externalUploadMiddleware = (fieldName: string) => {
	return multer({ storage: memoryStorage, limits: { fieldSize: 25 * 1024 * 1024 } }).single(fieldName);
};

export const externalUploadMultipleMiddleware = (fieldName: string) => {
	return multer({
		storage: memoryStorage,
		limits: { fieldSize: 25 * 1024 * 1024 }
	}).array(fieldName);
};
