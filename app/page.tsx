"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

export default function Home() {
	const webcamRef = useRef<any>(null);
	const canvasRef = useRef<any>(null);
	const [isWebcamOn, setIsWebcamOn] = useState(false);
	const [capturedImage, setCapturedImage] = useState(null);
	const [colorResult, setColorResult] = useState("");

	// Bật/tắt webcam
	const toggleWebcam = () => {
		setIsWebcamOn((prev) => !prev);
		setCapturedImage(null);
		setColorResult("");
	};

	// Chụp ảnh từ webcam
	const capture = useCallback(() => {
		if (!webcamRef.current) return;
		const imageSrc = webcamRef.current?.getScreenshot();
		setCapturedImage(imageSrc);
		analyzeColor(imageSrc);
	}, [webcamRef]);

	// Phân tích màu từ ảnh
	const analyzeColor = (imageSrc: string) => {
		const img = new Image();
		img.src = imageSrc;
		img.onload = () => {
			const canvas = canvasRef.current as any;
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			// Lấy dữ liệu điểm ảnh từ giữa ảnh
			const pixelData = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
			const [r, g, b] = pixelData;

			// Phân loại màu dựa trên giá trị RGB
			let detectedColor = "Không xác định";
			if (r < 50 && g < 50 && b < 50) {
				detectedColor = "Đen";
			} else if (r > 200 && g < 100 && b < 100) {
				detectedColor = "Đỏ";
			} else if (r > 200 && g > 150 && b < 100) {
				detectedColor = "Cát";
			}

			setColorResult(detectedColor);
		};
	};

	return (
		<div className='flex h-screen p-5 gap-5 bg-gray-100'>
			{/* Phần 1: Webcam và điều khiển */}
			<div className='flex-1 flex flex-col items-center justify-start'>
				<h1 className='text-3xl font-bold mb-5 text-gray-800'>Webcam Landing Analyzer</h1>
				{isWebcamOn ? (
					<>
						<Webcam
							audio={false}
							ref={webcamRef}
							screenshotFormat='image/jpeg'
							className='w-full max-w-[640px] h-auto border-2 border-gray-700 rounded-lg'
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

			{/* Phần 2: Hiển thị kết quả */}
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
							Màu nhận diện đất: <span className='font-bold text-blue-600'>{colorResult}</span>
						</p>
					</div>
				) : (
					<p className='text-gray-600'>Chưa có ảnh để phân tích.</p>
				)}
				{/* Canvas ẩn để phân tích */}
				<canvas ref={canvasRef} className='hidden' />
			</div>
		</div>
	);
}
