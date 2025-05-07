const plantData = [
	{
		name: "Cây xương rồng",
		humidityRange: [10, 30],
		phRange: [5.5, 7],
		temperatureRange: [20, 22],
		soilType: "Đất cát",
	},
	{
		name: "Cây thông",
		humidityRange: [20, 40],
		phRange: [5, 7],
		temperatureRange: [20, 22],
		soilType: "Đất cát",
	},
	{
		name: "Cây hương thảo",
		humidityRange: [20, 40],
		phRange: [6, 7],
		temperatureRange: [18, 20],
		soilType: "Đất cát",
	},
	{
		name: "Cây thanh long",
		humidityRange: [30, 50],
		phRange: [5.5, 7],
		temperatureRange: [25, 27],
		soilType: "Đất cát",
	},
	{
		name: "Cây mía",
		humidityRange: [70, 80],
		phRange: [6, 7],
		temperatureRange: [27, 29],
		soilType: "Đất đen",
	},
	{
		name: "Cây ngô",
		humidityRange: [60, 70],
		phRange: [5.8, 7],
		temperatureRange: [28, 30],
		soilType: "Đất đen",
	},
	{
		name: "Cây lúa",
		humidityRange: [70, 80],
		phRange: [5.5, 6.5],
		temperatureRange: [25, 27],
		soilType: "Đất đen",
	},
	{
		name: "Cây đậu",
		humidityRange: [40, 60],
		phRange: [6, 7],
		temperatureRange: [28, 30],
		soilType: "Đất đỏ",
	},
	{
		name: "Cây xà lách",
		humidityRange: [50, 70],
		phRange: [6, 7],
		temperatureRange: [20, 22],
		soilType: "Đất đen",
	},
	{
		name: "Cây cà chua",
		humidityRange: [50, 70],
		phRange: [6, 7],
		temperatureRange: [25, 27],
		soilType: "Đất đỏ",
	},
];


function getRecommendedPlant(
	info: { temperature: number; humidity: number; ph: number },
	soilType: string
) {
	return (
		plantData.find(
			(plant) =>
				info.temperature >= plant.temperatureRange[0] &&
				info.temperature <= plant.temperatureRange[1] &&
				info.humidity >= plant.humidityRange[0] &&
				info.humidity <= plant.humidityRange[1] &&
				info.ph >= plant.phRange[0] &&
				info.ph <= plant.phRange[1] &&
				soilType === plant.soilType
		)?.name || "Không tìm thấy cây phù hợp"
	);
}

export { getRecommendedPlant };