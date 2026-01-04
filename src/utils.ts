export interface TextStats {
	words: number;
	charsWithSpaces: number;
	charsWithoutSpaces: number;
	charsWithoutPunctuation: number;
}

export interface AnalysisOptions {
	excludeMarkdown?: boolean;
	excludeCodeBlocks?: boolean;
}

export function stripCodeBlocks(text: string): string {
	return text.replace(/```[\s\S]*?```/g, "");
}

export function stripMarkdown(text: string): string {
	return text
		.replace(/^#{1,6}\s+/gm, "") // Headers
		.replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
		.replace(/\*([^*]+)\*/g, "$1") // Italic
		.replace(/__([^_]+)__/g, "$1") // Bold alt
		.replace(/_([^_]+)_/g, "$1") // Italic alt
		.replace(/~~([^~]+)~~/g, "$1") // Strikethrough
		.replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, "$1") // Wiki links
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Markdown links
		.replace(/`([^`]+)`/g, "$1") // Inline code
		.replace(/^>\s+/gm, "") // Blockquotes
		.replace(/^[-*+]\s+/gm, "") // List markers
		.replace(/^\d+\.\s+/gm, ""); // Numbered lists
}

export function preprocessText(text: string, options: AnalysisOptions = {}): string {
	let processed = text;

	if (options.excludeCodeBlocks) {
		processed = stripCodeBlocks(processed);
	}

	if (options.excludeMarkdown) {
		processed = stripMarkdown(processed);
	}

	return processed;
}

export function analyzeText(text: string, options: AnalysisOptions = {}): TextStats {
	if (!text || text.trim().length === 0) {
		return {
			words: 0,
			charsWithSpaces: 0,
			charsWithoutSpaces: 0,
			charsWithoutPunctuation: 0,
		};
	}

	// Preprocess text based on options
	const processedText = preprocessText(text, options);

	// Word count: split by whitespace and filter empty strings
	const words = processedText.split(/\s+/).filter((word) => word.length > 0).length;

	// Characters with spaces
	const charsWithSpaces = processedText.length;

	// Characters without spaces
	const charsWithoutSpaces = processedText.replace(/\s/g, "").length;

	// Characters without punctuation (letters, numbers, and spaces only)
	const charsWithoutPunctuation = processedText.replace(/[^\w\s]/g, "").replace(/\s/g, "").length;

	return {
		words,
		charsWithSpaces,
		charsWithoutSpaces,
		charsWithoutPunctuation,
	};
}
