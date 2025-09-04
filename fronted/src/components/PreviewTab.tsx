"use client";

import React from "react";
import { useCode } from "../context/CodeContext";

export default function PreviewTab() {
	const { code } = useCode();

	// Combine all files into a complete HTML document
	const getCombinedHTML = () => {
		if (!code.html) return "";

		// Insert CSS and JS into the existing HTML
		let combinedHTML = code.html;

		// Add CSS if it exists
		if (code.css) {
			combinedHTML = combinedHTML.replace(
				/<\/head>/i,
				`<style>${code.css}</style>\n</head>`
			);
		}

		// Add JS if it exists
		if (code.js) {
			combinedHTML = combinedHTML.replace(
				/<\/body>/i,
				`<script>${code.js}</script>\n</body>`
			);
		}

		return combinedHTML;
	};

	const combinedHTML = getCombinedHTML();

	return (
		<div className="w-full h-full border bg-white rounded">
			{combinedHTML ? (
				<iframe
					srcDoc={combinedHTML}
					className="w-full h-full border-0"
					title="Preview"
					sandbox="allow-scripts"
				/>
			) : (
				<div className="flex items-center justify-center h-full text-gray-500">
					<p>No HTML content to preview</p>
				</div>
			)}
		</div>
	);
}
