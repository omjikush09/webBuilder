import { UIMessage } from "@ai-sdk/react";
import { useState, useCallback } from "react";
import { marked } from "marked";
import { parsePatch, applyPatch } from "diff";

export type FileName = "index.html" | "styles.css" | "script.js";

export function getMessageTextContent(message: UIMessage) {
	if (!message?.parts) return "";

	return message.parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("");
}

// Parse LLM response and extract file diffs
export function parseLLMResponse(content: string) {
	const result = {
		sections: {} as Record<string, string>,
		diffs: [] as Array<{
			filename: string;
			diffContent: string;
		}>,
		isComplete: false,
	};

	if (!content) return result;

	console.log("Full LLM response:", content);
	console.log("Response length:", content.length);
	console.log("Contains ### 📄:", content.includes("### 📄"));
	console.log("Contains markdown code blocks:", content.includes("```"));
	console.log("Looking for markdown parsing...");

	// Extract sections
	const sectionPatterns = [
		{ key: "building", pattern: /## 🎯 What I'm Building\n(.*?)(?=##|$)/s },
		{ key: "approach", pattern: /## 🧠 Technical Approach\n(.*?)(?=##|$)/s },
		{
			key: "explanation",
			pattern: /## 💡 What This Code Does\n(.*?)(?=##|$)/s,
		},
		{ key: "visual", pattern: /## 🎨 Visual Impact\n(.*?)(?=##|$)/s },
		{ key: "nextSteps", pattern: /## 🚀 Next Steps\n(.*?)(?=##|$)/s },
	];

	sectionPatterns.forEach(({ key, pattern }) => {
		const match = content.match(pattern);
		if (match) {
			result.sections[key] = match[1].trim();
		}
	});

	// Parse markdown and extract code blocks
	console.log("Parsing markdown content...");

	// Configure marked to preserve raw content
	marked.setOptions({
		breaks: true,
		gfm: true,
	});

	// Parse the markdown content
	const tokens = marked.lexer(content);
	console.log("Markdown tokens:", tokens);

	// Extract code blocks that follow ### 📄 headers
	let currentFilename = "";

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		// Look for headers with 📄 emoji
		if (token.type === "heading" && token.text.includes("📄")) {
			currentFilename = token.text.replace("📄", "").trim();
			console.log("Found file header:", currentFilename);
		}

		// Look for code blocks that follow the header
		if (token.type === "code" && currentFilename) {
			console.log(`Code block found for ${currentFilename}:`, token.text);

			// Check if this is a file we're tracking
			const fileExtension = currentFilename.split(".").pop()?.toLowerCase();
			if (
				fileExtension === "html" ||
				fileExtension === "css" ||
				fileExtension === "js"
			) {
				result.diffs.push({
					filename: currentFilename,
					diffContent: token.text,
				});
			}

			// Reset filename after processing
			currentFilename = "";
		}
	}

	// Check if response seems complete
	result.isComplete = content.includes("## 🚀 Next Steps");

	console.log(`Total diffs found: ${result.diffs.length}`);
	console.log(
		"Diffs:",
		result.diffs.map((d) => d.filename)
	);

	return result;
}

// Apply diff using diff library with corrected line counts
export function applyDiffToFile(
	currentContent: string,
	diffContent: string
): string {
	console.log("diffContent", diffContent);
	console.log("currentContent length:", currentContent.length);

	// Check if current file is empty (no existing content)
	const isFileEmpty = currentContent.trim().length === 0;

	// If file is empty and content doesn't have diff format, treat as direct code
	if (isFileEmpty && !diffContent.includes("@@")) {
		console.log("File is empty, treating content as direct code");
		return diffContent;
	}

	// Check if it's actually a diff format
	if (!diffContent.includes("@@")) {
		// Not a diff, treat as new content
		return diffContent;
	}

	try {
		// Parse the diff content and count actual lines
		const lines = diffContent.split("\n");
		const diffHeaderIndex = lines.findIndex((line) => line.startsWith("@@"));

		if (diffHeaderIndex === -1) {
			return currentContent;
		}

		// Extract the diff header
		const diffHeader = lines[diffHeaderIndex];
		console.log("Original diff header:", diffHeader);

		// Count actual + and - lines
		const contentLines = lines.slice(diffHeaderIndex + 1);
		const addedLines = contentLines.filter((line) =>
			line.startsWith("+")
		).length;
		const removedLines = contentLines.filter((line) =>
			line.startsWith("-")
		).length;
		const contextLines = contentLines.filter(
			(line) => !line.startsWith("+") && !line.startsWith("-")
		).length;

		console.log(
			"Line counts - Added:",
			addedLines,
			"Removed:",
			removedLines,
			"Context:",
			contextLines
		);

		// Create corrected diff header
		let correctedDiffHeader;
		if (isFileEmpty) {
			// For new files: @@ -0,0 +1,addedLines @@
			correctedDiffHeader = `@@ -0,0 +1,${addedLines} @@`;
		} else {
			// For existing files: @@ -start,removedLines +start,addedLines @@
			// Extract start line from original header
			const match = diffHeader.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
			if (match) {
				const startLine = parseInt(match[1]);
				// Count lines without sign (context lines)
				const unsignedLines = contentLines.filter(
					(line) => !line.startsWith("+") && !line.startsWith("-")
				).length;
				const minusCount = removedLines + unsignedLines;
				const plusCount = addedLines + unsignedLines;
				correctedDiffHeader = `@@ -${startLine},${minusCount} +${startLine},${plusCount} @@`;
			} else {
				correctedDiffHeader = diffHeader; // Keep original if can't parse
			}
		}

		console.log("Corrected diff header:", correctedDiffHeader);

		// Create corrected diff content
		const correctedDiffContent = [correctedDiffHeader, ...contentLines].join(
			"\n"
		);
		console.log("Corrected diff content:", correctedDiffContent);

		// Apply patches to current content using corrected diff
		const newContent = applyPatch(currentContent, correctedDiffContent, {
			fuzzFactor: 1,
			autoConvertLineEndings: true,
		});
		if (newContent === false) {
			console.warn(
				"applyPatch failed, falling back to direct content extraction"
			);
			// Fallback: extract content directly
			const extractedContent = contentLines
				.filter((line) => line.startsWith("+"))
				.map((line) => line.substring(1))
				.join("\n");
			return extractedContent;
		}
		return newContent;
	} catch (error) {
		console.warn("Diff failed:", error);
		// Show toast error and return original content
		console.error(
			"Failed to apply diff: " +
				(error instanceof Error ? error.message : String(error))
		);
		return currentContent;
	}
}

// File manager class
export class FileManager {
	private files: Record<FileName, string>;

	constructor() {
		this.files = {
			"index.html": "",
			"styles.css": "",
			"script.js": "",
		};
	}

	updateFiles(parsedResponse: any) {
		console.log("FileManager.updateFiles called with:", parsedResponse);
		parsedResponse.diffs.forEach((diff: any) => {
			console.log("Processing diff for:", diff.filename);
			console.log("Diff content:", diff.diffContent);
			if (this.files.hasOwnProperty(diff.filename)) {
				const oldContent = this.files[diff.filename];
				console.log("Old content length:", oldContent.length);

				// Simple: apply diff and replace content
				const newContent = applyDiffToFile(oldContent, diff.diffContent);
				console.log("New content length:", newContent.length);
				this.files[diff.filename] = newContent;
			}
		});
		console.log("Final files:", this.files);
		return { ...this.files };
	}

	getFile(filename: FileName) {
		return this.files[filename] || "";
	}

	getAllFiles() {
		return { ...this.files };
	}

	setFile(filename, content) {
		if (this.files.hasOwnProperty(filename)) {
			this.files[filename] = content;
		}
	}

	clearAll() {
		this.files = {
			"index.html": "",
			"styles.css": "",
			"script.js": "",
		};
	}
}

// React hook for easy integration
export function useFileManager() {
	const [fileManager] = useState(() => new FileManager());
	const [files, setFiles] = useState(fileManager.getAllFiles());

	const updateFiles = (parsedResponse) => {
		const updatedFiles = fileManager.updateFiles(parsedResponse);
		setFiles(updatedFiles);
		return updatedFiles;
	};

	return {
		files,
		updateFiles,
		getFile: (filename: FileName) => fileManager.getFile(filename),
		setFile: (filename, content) => {
			fileManager.setFile(filename, content);
			setFiles(fileManager.getAllFiles());
		},
		clearFiles: () => {
			fileManager.clearAll();
			setFiles(fileManager.getAllFiles());
		},
	};
}
