import { Schema, model, models } from "mongoose";

const DataSchema = new Schema({
	temperature: { type: Number, required: true },
	humidity: { type: Number, required: true },
	ph: { type: Number, required: true },
});

const Data = models.Data || model("Data", DataSchema);

export default Data;
