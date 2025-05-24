import connectToDatabase from "@/lib/mongodb";
import History from "@/models/history.model";
import { NextResponse } from "next/server";

// POST API: Add new history data
export async function POST(req: Request) {
	try {
		// Connect to MongoDB
		await connectToDatabase();

		// Parse request body
		const body = await req.json();

		// Validate required fields
		const { treeType, soilType, temperature, humidity, pH } = body;


		// Save to the database
		const history = new History({ treeType, soilType, temperature, humidity, pH });
		await history.save();
		console.log("history", history);
		// Respond with the created document
		return NextResponse.json(
			{ message: "History saved successfully", data: history },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error saving history:", error);
		return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
	}
}

// GET API: Retrieve all history data
export async function GET() {
	try {
		// Connect to MongoDB
		await connectToDatabase();

		// Fetch all history documents
		const histories = await History.find();

		// Respond with the fetched data
		return NextResponse.json(
			{ message: "History fetched successfully", data: histories },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching history:", error);
		return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
	}
}
