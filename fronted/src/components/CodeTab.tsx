"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useCode } from "../context/CodeContext";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-full">
			Loading editor...
		</div>
	),
});

type FileType = "html" | "css" | "js";

const fileConfig: {
	[key in FileType]: { name: string; language: string; icon: string };
} = {
	html: { name: "index.html", language: "html", icon: "📄" },
	css: { name: "styles.css", language: "css", icon: "🎨" },
	js: { name: "script.js", language: "javascript", icon: "⚡" },
};

export function CodeTab() {
	const { code } = useCode();
	const [activeFile, setActiveFile] = useState<FileType>("html");
	const currentContent = code[activeFile];
	const currentConfig = fileConfig[activeFile];

	return (
		<div className="h-full border-[0.5px] rounded-lg overflow-hidden flex">
			{/* Left Panel - File Explorer (20% width) */}
			<div className="w-1/5  p-4 border-r  bg-background">
				<h3 className="text-sm font-semibold mb-4 ">File Explorer</h3>
				<div className="space-y-2">
					{Object.entries(fileConfig).map(([type, config]) => (
						<div
							key={type}
							className={`text-sm p-2 hover:bg-muted-foreground rounded cursor-pointer ${
								activeFile === type ? "bg-blue-950/50" : ""
							}`}
							onClick={() => setActiveFile(type as FileType)}
						>
							{config.icon} {config.name}
						</div>
					))}
				</div>
			</div>

			{/* Right Panel - Code Editor */}
			<div className="flex-1 flex flex-col">
				<div className="bg-muted-foreground p-2 border-b flex items-center justify-between">
					<span className="text-sm font-medium">{currentConfig.name}</span>
					<div className="text-xs ">{currentConfig.language.toUpperCase()}</div>
				</div>

				<MonacoEditor
					language={currentConfig.language}
					value={currentContent}
					theme="vs-dark"
					options={{
						readOnly: true,
						scrollBeyondLastLine: false,
						selectionClipboard: true,
						minimap: { enabled: false },
						wordWrap: "on",
					}}
				/>
			</div>
		</div>
	);
}
