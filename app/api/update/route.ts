import openDb from "@/db";

export async function POST(req: Request) {
	try {
		const body = await req.json(); // Parse dữ liệu JSON từ body
		const { temperature, humidity, ph } = body;

		const db = await openDb(); // Kết nối database

		// Thêm hoặc cập nhật dữ liệu
		const query = `
			INSERT INTO environment_data (id, temperature, humidity, ph)
			VALUES (1, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET
				temperature = excluded.temperature,
				humidity = excluded.humidity,
				ph = excluded.ph;
		`;

		await db.run(query, [temperature, humidity, ph]);

		return new Response(JSON.stringify({ success: true, message: "Data upserted successfully" }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error in API:", error);
		return new Response(JSON.stringify({ success: false, error: "Database error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
