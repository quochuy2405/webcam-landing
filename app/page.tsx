"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

export default function Home() {
	const webcamRef = useRef<any>(null);
	const canvasRef = useRef<any>(null);
	const [isWebcamOn, setIsWebcamOn] = useState(false);
	const [capturedImage, setCapturedImage] = useState<any>(null);
	const [colorResult, setColorResult] = useState("");
	const [rgbValues, setRgbValues] = useState<any>(null);

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
					soilType = chroma > 20 ? "Đất đỏ nâu" : "Đất đen xám";
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


	return (
		<div className='flex h-screen p-5 gap-5 bg-gray-100'>
			<div className='flex-1 flex flex-col items-center justify-start'>
				<h1 className='text-3xl font-bold mb-5 text-gray-800'>Phân tích màu đất qua Webcam</h1>
				{isWebcamOn ? (
					<>
						<Webcam
							audio={false}
							ref={webcamRef}
							screenshotFormat='image/jpeg'
							className='w-full max-w-[640px] h-auto border-2 border-gray-700 rounded-lg'
							videoConstraints={{
								width: 1280,
								height: 720,
								facingMode: "environment",
							}}
						/>
						<div className='mt-5 flex gap-3'>
							<button
								onClick={toggleWebcam}
								className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition'>
								Tắt Webcam
							</button>
							<button
								onClick={capture}
								className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'>
								Chụp Ảnh
							</button>
						</div>
					</>
				) : (
					<button
						onClick={toggleWebcam}
						className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition'>
						Bật Webcam
					</button>
				)}
			</div>

			<div className='flex-1 flex flex-col items-center justify-start'>
				<h2 className='text-2xl font-semibold mb-5 text-gray-800'>Kết quả</h2>
				{capturedImage ? (
					<div className='text-center'>
						<img
							src={capturedImage}
							alt='Captured'
							className='w-full max-w-[640px] h-auto border-2 border-gray-700 rounded-lg mb-5'
						/>
						<p className='text-lg'>
							Loại đất: <span className='font-bold text-blue-600'>{colorResult}</span>
						</p>
						{rgbValues && (
							<p className='text-lg'>
								Giá trị RGB: ({rgbValues.r}, {rgbValues.g}, {rgbValues.b})
							</p>
						)}
					</div>
				) : (
					<p className='text-gray-600'>Chưa có ảnh để phân tích.</p>
				)}
				<canvas ref={canvasRef} className='hidden' />
			</div>
		</div>
	);
}
