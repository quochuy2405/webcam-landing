import Data from "@/models/data.model";
import connectToDatabase from "@/lib/mongodb";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data.json");

// Hàm đọc dữ liệu từ file JSON
function readData() {
	if (!fs.existsSync(dataFilePath)) {
		// Initialize with empty data if file doesn't exist
		writeData({ id: 1, temperature: 0, humidity: 0, ph: 0 });
		return { id: 1, temperature: 0, humidity: 0, ph: 0 };
	}
	const data = fs.readFileSync(dataFilePath, "utf8");
	return JSON.parse(data);
}

// Hàm ghi dữ liệu vào file JSON
function writeData(data: any) {
	fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(req: Request) {
	try {
		await connectToDatabase();
		
		const body = await req.json();
		const { temperature, humidity, ph } = body;
		
		// Update the first record or create one if it doesn't exist
		const data = await Data.findOneAndUpdate(
			{}, // empty filter to match the first document
			{ temperature, humidity, ph },
			{ 
				new: true, // return the updated document
				upsert: true, // create if it doesn't exist
				setDefaultsOnInsert: true // apply default values if creating new doc
			}
		);
		
		return new Response(JSON.stringify({ success: true, data }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		console.error("Error in API:", error);
		return new Response(JSON.stringify({ success: false, error: error.message || "Database error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
