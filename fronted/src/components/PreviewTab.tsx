"use client";

import React from "react";
import { useCode } from "../context/CodeContext";

export default function PreviewTab() {
	const { code } = useCode();

	// Combine all files into a complete HTML document
	const getCombinedHTML = () => {
		if (!code.html) return "";

		// Create a complete HTML document with embedded CSS and JS
		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        ${code.css}
    </style>
</head>
<body>
    ${code.html
			.replace(/<head>[\s\S]*?<\/head>/gi, "")
			.replace(/<script[\s\S]*?<\/script>/gi, "")}
    <script>
        ${code.js}
    </script>
</body>
</html>`;
	};

	const combinedHTML = getCombinedHTML();

	return (
		<div className="w-full h-full border  bg-white rounded">
			{combinedHTML ? (
				<iframe
					srcDoc={combinedHTML}
					className="w-full h-full border-0"
					title="Preview"
					sandbox="allow-scripts allow-same-origin"
				/>
			) : (
				<div className="flex items-center justify-center h-full text-gray-500">
					<p>No HTML content to preview</p>
				</div>
			)}
		</div>
	);
}
