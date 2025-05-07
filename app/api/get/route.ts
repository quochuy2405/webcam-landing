import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data.json");

// Hàm đọc dữ liệu từ file JSON
function readData() {
	const data = fs.readFileSync(dataFilePath, "utf8");
	return JSON.parse(data);
}

export async function GET() {
	try {
		// Đọc dữ liệu từ file JSON
		const data = readData();

		// Trả về dữ liệu dưới dạng JSON
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error in GET API:", error);
		return new Response(JSON.stringify({ success: false, error: "File read error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
