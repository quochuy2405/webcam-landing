import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Kiểm tra biến môi trường
if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
	// eslint-disable-next-line no-var
	var mongoose: any;
}

// Sử dụng bộ nhớ đệm để tối ưu hóa kết nối khi dùng serverless
const cached: any = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
	global.mongoose = cached;
}

async function connectToDatabase(): Promise<typeof mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI!).then((mongooseInstance) => mongooseInstance);
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default connectToDatabase;
