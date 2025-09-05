import { UIMessage } from "@ai-sdk/react";
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

export type Diff = {
	filename: FileName;
	diffContent: string;
};
/**
 * Extracts diffs from LLM response
 * @param content - The LLM response
 * @returns The diffs
 */
export function extractDiffFromLLMResponse(content: string) {
	const result: { diffs: Diff[] } = {
		diffs: [],
	};

	// Configure marked to preserve raw content
	marked.setOptions({
		breaks: true,
		gfm: true,
	});

	// Parse the markdown content
	const tokens = marked.lexer(content);

	// Extract code blocks that follow ### 📄 headers
	let currentFilename = "";

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		// Look for headers with 📄 emoji
		if (token.type === "heading" && token.text.includes("📄")) {
			currentFilename = token.text.replace("📄", "").trim();
		}

		// Look for code blocks that follow the header
		if (token.type === "code" && currentFilename) {
			// Check if this is a file we're tracking
			const fileExtension = currentFilename.split(".").pop()?.toLowerCase();
			if (fileExtension == "html") {
				result.diffs.push({
					filename: "index.html",
					diffContent: token.text,
				});
			} else if (fileExtension == "css") {
				result.diffs.push({
					filename: "styles.css",
					diffContent: token.text,
				});
			} else if (fileExtension == "js") {
				result.diffs.push({
					filename: "script.js",
					diffContent: token.text,
				});
			}

			// Reset filename after processing
			currentFilename = "";
		}
	}

	return result;
}

// Apply diff using diff library with corrected line counts
export function applyDiffToFile(
	currentContent: string,
	diffContent: string
): string {
	// Check if current file is empty (no existing content)
	const isFileEmpty = currentContent.trim().length === 0;

	// If file is empty and content doesn't have diff format, treat as direct code
	if (isFileEmpty && !diffContent.includes("@@")) {
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

		// Extract the diff header
		const diffHeader = lines[diffHeaderIndex];

		// Count actual + and - lines
		const contentLines = lines.slice(diffHeaderIndex + 1);
		const addedLines = contentLines.filter((line) =>
			line.startsWith("+")
		).length;
		const removedLines = contentLines.filter((line) =>
			line.startsWith("-")
		).length;
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

		// Create corrected diff content
		const correctedDiffContent = [correctedDiffHeader, ...contentLines].join(
			"\n"
		);

		// Apply patches to current content using corrected diff
		const newContent = applyPatch(currentContent, correctedDiffContent, {
			fuzzFactor: 1,
			autoConvertLineEndings: true,
		});
		if (newContent === false) {
			console.warn(
				"applyPatch failed, falling back to direct content extraction"
			);
			// Fallback: return original content
			return currentContent;
		}
		return newContent;
	} catch (error) {
		return currentContent;
	}
}

/**
 * Process UI Message through the complete pipeline and return updated files
 * @param message - The UI Message to process
 * @param currentFiles - Current file contents
 * @returns Updated file contents after applying diffs
 */
export function processMessageToFiles(
	message: UIMessage,
	currentFiles: Record<FileName, string>
): Record<FileName, string> {
	// Step 1: Extract text content from message
	const textContent = getMessageTextContent(message);
	// Step 2: Extract diffs from LLM response
	const parsedResponse = extractDiffFromLLMResponse(textContent);

	// Step 3: Apply diffs to current files
	const updatedFiles = { ...currentFiles };

	parsedResponse.diffs.forEach((diff) => {
		const filename = diff.filename;
		const oldContent = updatedFiles[filename];
		const newContent = applyDiffToFile(oldContent, diff.diffContent);
		updatedFiles[filename] = newContent;
	});

	return updatedFiles;
}
