import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data.json");

// Hàm đọc dữ liệu từ file JSON
function readData() {
	const data = fs.readFileSync(dataFilePath, "utf8");
	return JSON.parse(data);
}

// Hàm ghi dữ liệu vào file JSON
function writeData(data: any) {
	fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { temperature, humidity, ph } = body;
		writeData({
			id: 1,
			temperature,
			humidity,
			ph,
		});

		return new Response(JSON.stringify({ success: true, message: "Data upserted successfully" }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error in API:", error);
		return new Response(JSON.stringify({ success: false, error: "File read/write error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
