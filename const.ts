const plantData = [
	{
		name: "Cây xương rồng",
		humidityRange: [10, 30],
		phRange: [5.5, 7],
		temperatureRange: [20, 22],
		soilType: "Đất cát",
		image:
			"https://platthillnursery.com/wp-content/uploads/2024/02/cactus-4-plain-Isolated-Platt-Hill-Nursery-1000x1000-1-600x600.webp",
	},
	{
		name: "Cây thông",
		humidityRange: [20, 40],
		phRange: [5, 7],
		temperatureRange: [20, 22],
		soilType: "Đất cát",
		image: "https://caygionglamnghiep1.com/wp-content/uploads/2023/03/cay-thong-la-kim-3.jpg",
	},
	{
		name: "Cây hương thảo",
		humidityRange: [20, 40],
		phRange: [6, 7],
		temperatureRange: [18, 20],
		soilType: "Đất cát",
		image:
			"https://static-images.vnncdn.net/files/publish/2022/10/29/cay-huong-thao-609.jpg?width=0&s=-uXPDSL9hmgrBJhNwYM5_Q",
	},
	{
		name: "Cây thanh long",
		humidityRange: [30, 50],
		phRange: [5.5, 7],
		temperatureRange: [25, 27],
		soilType: "Đất cát",
		image:
			"https://media.la34.com.vn/upload/image/202210/medium/1272011_thanh_long_bv_11235102.png",
	},
	{
		name: "Cây mía",
		humidityRange: [70, 80],
		phRange: [6, 7],
		temperatureRange: [27, 29],
		soilType: "Đất đen",
		image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Sugar_cane_in_Hainan_-_02.jpg",
	},
	{
		name: "Cây ngô",
		humidityRange: [60, 70],
		phRange: [5.8, 7],
		temperatureRange: [28, 30],
		soilType: "Đất đen",
		image: "https://thafaco.vn/wp-content/uploads/2024/01/ngo.jpg",
	},
	{
		name: "Cây lúa",
		humidityRange: [70, 80],
		phRange: [5.5, 6.5],
		temperatureRange: [25, 27],
		soilType: "Đất đen",
		image: "https://mayahm.vn/wp-content/uploads/2024/02/Cay-lua-nuoc-1-1.jpeg",
	},
	{
		name: "Cây đậu",
		humidityRange: [40, 60],
		phRange: [6, 7],
		temperatureRange: [28, 30],
		soilType: "Đất đỏ",
		image: "https://sasaki.com.vn/wp-content/uploads/2024/05/cach-trong-cay-dau-xanh.png",
	},
	{
		name: "Cây xà lách",
		humidityRange: [50, 70],
		phRange: [6, 7],
		temperatureRange: [20, 22],
		soilType: "Đất đen",
		image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/X%C3%A0_l%C3%A1ch.jpg",
	},
	{
		name: "Cây cà chua",
		humidityRange: [50, 70],
		phRange: [6, 7],
		temperatureRange: [25, 27],
		soilType: "Đất đỏ",
		image: "https://vuonbabylon.vn/wp-content/uploads/2021/01/ca-chua-bi-lun-do21_1.jpg",
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
		) ||{name: "Không tìm thấy cây phù hợp", image: ""}
	);
}

export { getRecommendedPlant };
