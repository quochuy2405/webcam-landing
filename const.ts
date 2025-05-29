// Soil-based plant data categorized by soil type
const soilPlantData = {
	"Đất cát": [
		{
			name: "Cây chanh",
			humidityRange: [70, 80],
			phRange: [5.5, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcRVybpXgJSRo1xXY3pviFWsLudOvTwVsGMw&s",
		},
		{
			name: "Cây nhãn",
			humidityRange: [65, 75],
			phRange: [5.5, 6.5],
			image: "https://cayxanhgiapham.com/wp-content/uploads/2020/06/cay-nhan-3-600x608.jpg",
		},
		{
			name: "Cây Xoài",
			humidityRange: [60, 70],
			phRange: [6.0, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpvAQY4dWncsisy9qRhAA87GcCIsewQGGfA&s",
		},
		{
			name: "Cây Nho",
			humidityRange: [55, 65],
			phRange: [6.0, 6.5],
			image: "https://traceverified.com/wp-content/uploads/2019/01/ky-thuat-trong-nho-do.jpg",
		},
		{
			name: "Cây thanh long",
			humidityRange: [55, 65],
			phRange: [5.5, 6.5],
			image: "https://vidanvn.com/oamaglah/2020/12/ky-thuat-trong-thanh-long-ruot-do-1.jpg",
		},
	],
	"Đất đỏ": [
		{
			name: "Cây cà phê",
			humidityRange: [60, 70],
			phRange: [5.5, 6.5],
			image: "https://caphekhoanbetong.com/wp-content/uploads/2021/09/cac-loai-cay-ca-phe-pho-bien-o-viet-nam.jpg",
		},
		{
			name: "Cây hồ tiêu",
			humidityRange: [60, 70],
			phRange: [5.5, 6.5],
			image: "https://giatieu.com/wp-content/uploads/2013/11/tieu-cho-nang-suat-cao.jpg",
		},
		{
			name: "Cây cao su",
			humidityRange: [60, 70],
			phRange: [5.0, 6.5],
			image: "https://caosugiongminhsu.com/upload/images/Cao-su-tu-nhien-1.jpg",
		},
		{
			name: "Cây sầu riêng",
			humidityRange: [65, 75],
			phRange: [5.5, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6jGaMlUDxx6iAja1tTFBFCjKfCGUU2ecfUw&s",
		},
		{
			name: "Cây chè",
			humidityRange: [60, 75],
			phRange: [4.5, 5.5],
			image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/7/3/h1-hinh-1-nhung-dieu-thu-vi-ve-dac-diem-cay-che-dac-diem-sinh-thai-vung-mien1-1656859695050198595599.jpg",
		},
	],
	"Đất đen": [
		{
			name: "Cây cam",
			humidityRange: [60, 70],
			phRange: [5.5, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoqAJcLVgZQYdBxrac8prAhpdFeilL83vR_A&s",
		},
		{
			name: "Cây quýt",
			humidityRange: [60, 70],
			phRange: [5.5, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgtHqVMkVAN5y1Yhugl6-84w00RtLrox4YNQ&s",
		},
		{
			name: "Cây bơ",
			humidityRange: [60, 70],
			phRange: [5.5, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIHjD_4tZRgaWV4P91aVc3DHZTg6SJCd9AZQ&s",
		},
		{
			name: "Cây sầu riêng",
			humidityRange: [65, 75],
			phRange: [5.5, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz5lodJgo6e4t2UsZlqLzQIy65GO4woh0w7Q&s",
		},
		{
			name: "Cây bưởi",
			humidityRange: [60, 70],
			phRange: [5.5, 6.5],
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShpi2jq7SNyzk0uPnzlpBaoLgYidWhBDLmMA&s",
		},
	],
};

// Get all plants suitable for a specific soil type
function getPlantsForSoilType(soilType: string) {
	return soilPlantData[soilType as keyof typeof soilPlantData] || [];
}

// Get the best recommended plant based on soil type, pH, and humidity
function getRecommendedPlant(
	info: { humidity: number; ph: number },
	soilType: string
) {
	const suitablePlants = getPlantsForSoilType(soilType);
	
	if (suitablePlants.length === 0) {
		return { name: "Không tìm thấy cây phù hợp", image: "" };
	}

	// Find the best match based on pH and humidity
	const bestMatch = suitablePlants.find(
		(plant) =>
			info.humidity >= plant.humidityRange[0] &&
			info.humidity <= plant.humidityRange[1] &&
			info.ph >= plant.phRange[0] &&
			info.ph <= plant.phRange[1]
	);

	// If no exact match, return the first plant from the soil type
	return bestMatch || suitablePlants[0];
}

// Get soil characteristics description
function getSoilCharacteristics(soilType: string) {
	const characteristics = {
		"Đất cát": "Màu vàng nhạt, trắng, thoát nước nhanh, nghèo dưỡng chất",
		"Đất đỏ": "Màu đỏ đặc trưng, giàu khoáng chất, giữ nước tốt",
		"Đất đen": "Màu đen, giàu chất hữu cơ, giữ ẩm tốt, rất màu mỡ, phù hợp cây ăn quả dài ngày",
	};
	
	return characteristics[soilType as keyof typeof characteristics] || "Không xác định đặc điểm";
}

export { getRecommendedPlant, getPlantsForSoilType, getSoilCharacteristics };
