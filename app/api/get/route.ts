import Data from "@/models/data.model";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
	try {
		// Đọc dữ liệu từ file JSON
		await connectToDatabase();
		const data = await Data.findOne();
		return new Response(JSON.stringify({ success: true, data }), {
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
