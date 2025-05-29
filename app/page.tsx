"use client";

import { getRecommendedPlant, getPlantsForSoilType, getSoilCharacteristics } from "@/const";
import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import * as XLSX from "xlsx";

export default function Home() {
	const [info, setInfo] = useState({
		humidity: 0,
		ph: 0,
	});
	const webcamRef = useRef<any>(null);
	const canvasRef = useRef<any>(null);
	const [isWebcamOn, setIsWebcamOn] = useState(false);
	const [capturedImage, setCapturedImage] = useState<any>(null);
	const [colorResult, setColorResult] = useState("");
	const [rgbValues, setRgbValues] = useState<any>(null);
	const [environmentData, setEnvironmentData] = useState<any[]>([]);

	useEffect(() => {
		const fetchEnvironmentData = async () => {
			try {
				const res = await fetch("/api/get");
				const data = await res.json();
				setInfo({
					humidity: data.data.humidity,
					ph: data.data.ph,
				});

				// Add timestamp to environment data for Excel export
				const timestamp = new Date().toLocaleString();
				setEnvironmentData((prevData) => [
					...prevData,
					{
						timestamp,
						humidity: data.data.humidity,
						ph: data.data.ph,
					},
				]);

				// Keep only the latest 100 records to prevent memory issues
				if (environmentData.length > 100) {
					setEnvironmentData((prevData) => prevData.slice(-100));
				}
			} catch (error) {
				console.error("Failed to fetch environment data:", error);
			}
		};

		const interval = setInterval(() => {
			fetchEnvironmentData();
		}, 2000);

		return () => clearInterval(interval);
	}, [environmentData.length]);

	// Toggle webcam
	const toggleWebcam = () => {
		setIsWebcamOn((prev) => !prev);
		setCapturedImage(null);
		setColorResult("");
		setRgbValues(null);
	};

	// Capture image from webcam
	const capture = useCallback(() => {
		if (!webcamRef.current) return;
		const imageSrc = webcamRef.current.getScreenshot();
		setCapturedImage(imageSrc);
		analyzeColor(imageSrc);
	}, []);

	// Analyze color from image
	const analyzeColor = (imageSrc: string) => {
		const img = new Image();
		img.src = imageSrc;
		img.onload = () => {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			// Sample from center 1/3 of the image
			const width = img.width;
			const height = img.height;
			const startX = width / 3;
			const startY = height / 3;
			const sampleWidth = width / 3;
			const sampleHeight = height / 3;

			const pixelData = ctx.getImageData(startX, startY, sampleWidth, sampleHeight).data;
			const pixelCount = sampleWidth * sampleHeight;

			// Calculate average RGB
			let totalR = 0,
				totalG = 0,
				totalB = 0;
			for (let i = 0; i < pixelData.length; i += 4) {
				totalR += pixelData[i];
				totalG += pixelData[i + 1];
				totalB += pixelData[i + 2];
			}

			const avgR = Math.round(totalR / pixelCount);
			const avgG = Math.round(totalG / pixelCount);
			const avgB = Math.round(totalB / pixelCount);
			setRgbValues({ r: avgR, g: avgG, b: avgB });

			// Improved soil color classification
			let soilType = "Không xác định";

			// Calculate value (lightness) and chroma
			const value = Math.max(avgR, avgG, avgB) / 2.55; // Normalized to 0-100 scale
			const chroma = Math.sqrt((avgR - avgG) ** 2 + (avgG - avgB) ** 2);

			// Soil color classification
			if (value < 30) {
				soilType = "Đất đen";
			} else if (value < 50) {
				if (avgR > avgG && avgR > avgB) {
					soilType = chroma > 20 ? "Đất đỏ" : "Đất đen";
				} else {
					soilType = "Đất đen";
				}
			} else if (value < 70) {
				if (avgR > avgG && avgR > avgB) {
					soilType = "Đất đỏ";
				} else if (avgG > avgR && avgG > avgB) {
					soilType = "Đất vàng";
				} else {
					soilType = "Đất cát";
				}
			} else {
				if (avgR > 200 && avgG > 200 && avgB > 200) {
					soilType = "Đất cát";
				} else {
					soilType = "Đất cát";
				}
			}

			setColorResult(soilType);
		};
	};

	// Export environment data to Excel
	const exportToExcel = async () => {
		try {
			// Fetch history data from backend
			const res = await fetch("/api/history");
			if (!res.ok) {
				throw new Error("Failed to fetch history data");
			}
			const historyData = await res.json();

			// Create a new workbook
			const wb = XLSX.utils.book_new();

			// Map and format data (removed temperature)
			const data = historyData.data.map((i: any) => ({
				Thời_gian: i.createdAt, // Format timestamp
				Độ_ẩm: i.humidity || "N/A",
				pH: i.pH || "N/A",
				Loại_đất: i.soilType || "N/A",
				Loại_cây_trồng: i.treeType || "N/A",
			}));

			// Create worksheet
			const ws = XLSX.utils.json_to_sheet(data);

			// Add column headers (removed temperature)
			XLSX.utils.sheet_add_aoa(
				ws,
				[["Thời gian", "Độ ẩm (%)", "pH", "Loại đất", "Loại cây trồng"]],
				{ origin: "A1" }
			);

			// Set column widths (removed temperature)
			ws["!cols"] = [
				{ wch: 20 }, // timestamp
				{ wch: 10 }, // humidity
				{ wch: 10 }, // ph
				{ wch: 15 }, // soil type
				{ wch: 20 }, // plant type
			];

			// Add worksheet to workbook
			XLSX.utils.book_append_sheet(wb, ws, "Lịch sử dữ liệu");

			// Generate Excel file and trigger download
			const fileName = `LichSuDuLieu_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`;
			XLSX.writeFile(wb, fileName);
		} catch (error) {
			console.error("Failed to export history data:", error);
		}
	};

	useEffect(() => {
		if (getRecommendedPlant(info, colorResult).image) {
			fetch("/api/history", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					humidity: info.humidity,
					ph: info.ph,
					soilType: colorResult,
					treeType: getRecommendedPlant(info, colorResult).name,
				}),
			});
		}
	}, [colorResult, JSON.stringify(info)]);

	// Get suitable plants for current soil type
	const suitablePlants = getPlantsForSoilType(colorResult);
	const recommendedPlant = getRecommendedPlant(info, colorResult);
	const soilCharacteristics = getSoilCharacteristics(colorResult);

	return (
		<div className='flex flex-col h-screen p-5 bg-gradient-to-br from-[#1E3A8A] via-[#9333EA] to-[#FF5F6D] text-white'>
			<div className='flex w-full flex-1'>
				<div className='flex-1 flex flex-col items-center justify-start'>
					<h1 className='text-4xl font-extrabold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#FFDEE9] via-[#B5FFFC] to-[#7BF1A8] animate-gradient'>
						Phân tích màu đất qua Webcam
					</h1>
					{isWebcamOn ? (
						<>
							<Webcam
								audio={false}
								ref={webcamRef}
								screenshotFormat='image/jpeg'
								className='w-full max-w-[640px] h-auto border-[3px] border-transparent rounded-3xl shadow-xl bg-gradient-to-r from-[#FFDEE9] via-[#B5FFFC] to-[#7BF1A8] p-2'
								videoConstraints={{
									width: 1280,
									height: 720,
									facingMode: "environment",
								}}
							/>
							<div className='mt-5 flex gap-3'>
								<button
									onClick={toggleWebcam}
									className='px-6 py-3 bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] text-white rounded-lg hover:scale-105 transition shadow-md hover:shadow-lg'>
									Tắt Webcam
								</button>
								<button
									onClick={capture}
									className='px-6 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#9333EA] text-white rounded-lg hover:scale-105 transition shadow-md hover:shadow-lg'>
									Chụp Ảnh
								</button>
							</div>
						</>
					) : (
						<button
							onClick={toggleWebcam}
							className='px-6 py-3 bg-gradient-to-r from-[#34D399] to-[#3B82F6] text-white rounded-lg hover:scale-105 transition shadow-md hover:shadow-lg'>
							Bật Webcam
						</button>
					)}
				</div>

				<div className='flex-1 flex flex-col items-center justify-start'>
					<h2 className='text-3xl font-semibold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FF7C00] to-[#FF4E00] animate-gradient'>
						Kết quả
					</h2>
					{capturedImage ? (
						<div className='text-center'>
							<img
								src={capturedImage}
								alt='Captured'
								className='w-full max-w-[640px] h-auto border-[3px] border-transparent rounded-3xl shadow-xl mb-5 bg-gradient-to-r from-[#FFC3A0] to-[#FFAFBD] p-2'
							/>
							<p className='text-lg mb-2'>
								Loại đất: <span className='font-bold text-[#FFE066]'>{colorResult}</span>
							</p>
							{colorResult && (
								<p className='text-sm mb-4 text-gray-200'>Đặc điểm: {soilCharacteristics}</p>
							)}
						</div>
					) : (
						<p className='text-gray-300'>Chưa có ảnh để phân tích.</p>
					)}
					<canvas ref={canvasRef} className='hidden' />
				</div>

				{/* Environment and Recommendation Panel */}
			</div>

			<div className='flex w-full justify-between'>
				{/* Plant List for Soil Type */}
				<div className='flex-1 flex'>
					{suitablePlants.length > 0 && (
						<div className=''>
							<h3 className='text-xl font-semibold mb-3 text-[#7BF1A8]'>
								Các cây trồng phù hợp với {colorResult}:
							</h3>
							<div className='flex  gap-2 mx-auto'>
								{suitablePlants.map((plant, index) => (
									<div key={index} className='bg-white bg-opacity-20 p-3 rounded-lg text-center'>
										<img
											src={plant.image}
											alt={plant.name}
											className='w-16 h-16 object-cover rounded-lg mx-auto mb-2'
										/>
										<p className='text-sm font-medium'>{plant.name}</p>
										<p className='text-xs text-black'>
											Độ ẩm: {plant.humidityRange[0]}-{plant.humidityRange[1]}%
										</p>
										<p className='text-xs text-black'>
											pH: {plant.phRange[0]}-{plant.phRange[1]}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div className='bg-white p-4 text-black rounded-3xl  flex  justify-between relative h-full'>
					<div className='flex-1'>
						<div className='flex justify-between items-start'>
							<p className='text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FF7C00] to-[#FF4E00] animate-gradient'>
								Thông số môi trường
							</p>
							<button
								onClick={exportToExcel}
								className='px-3 py-1 absolute bottom-2 right-2 text-xs bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-lg hover:scale-105 transition shadow-md hover:shadow-lg ml-2'>
								Export Excel
							</button>
						</div>
						<ul className='list-disc px-4 font-bold mb-4'>
							<li>Độ ẩm: {info.humidity}%</li>
							<li>PH: {info.ph}</li>
						</ul>
					</div>

					{/* Best Recommendation */}
					{recommendedPlant.image && (
						<div className='flex justify-center flex-1 items-center'>
							<img
								src={recommendedPlant.image}
								alt='Cây trồng phù hợp nhất'
								className='w-[100px] h-[100px] object-cover rounded-3xl mx-auto mb-3'
							/>
							<div className='text-center'>
								<span className='font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FF7C00] to-[#FF4E00] animate-gradient block mb-1'>
									🌟 Đề xuất tốt nhất
								</span>
								<p className='font-bold text-green-600 mb-2'>{recommendedPlant.name}</p>
								<p className='text-xs text-gray-600'>Phù hợp với độ ẩm và pH hiện tại</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
