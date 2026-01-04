export interface TextStats {
	words: number;
	charsWithSpaces: number;
	charsWithoutSpaces: number;
	charsWithoutPunctuation: number;
}

export function analyzeText(text: string): TextStats {
	if (!text || text.trim().length === 0) {
		return {
			words: 0,
			charsWithSpaces: 0,
			charsWithoutSpaces: 0,
			charsWithoutPunctuation: 0,
		};
	}

	// Word count: split by whitespace and filter empty strings
	const words = text.split(/\s+/).filter((word) => word.length > 0).length;

	// Characters with spaces
	const charsWithSpaces = text.length;

	// Characters without spaces
	const charsWithoutSpaces = text.replace(/\s/g, "").length;

	// Characters without punctuation (letters, numbers, and spaces only)
	const charsWithoutPunctuation = text.replace(/[^\w\s]/g, "").replace(/\s/g, "").length;

	return {
		words,
		charsWithSpaces,
		charsWithoutSpaces,
		charsWithoutPunctuation,
	};
}
