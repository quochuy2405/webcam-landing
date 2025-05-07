import openDb from "@/db";

// Lấy danh sách dữ liệu
export async function GET() {
	try {
		const db = await openDb();
		const rows = await db.all("SELECT * FROM environment_data");

		return new Response(JSON.stringify(rows), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error in GET API:", error);
		return new Response(JSON.stringify({ success: false, error: "Database error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
