import mongoose, { model, models } from "mongoose";

const historySchema = new mongoose.Schema({
	treeType: {
		type: String,
	},
	soilType: {
		type: String,
	},
	temperature: {
		type: Number, // Assuming temperature is a number
	},
	humidity: {
		type: Number, // Assuming humidity is a number
	},
	ph: {
		type: Number, // Assuming pH is a number
	},
});

const History = models.History || model("History", historySchema);

export default History;
