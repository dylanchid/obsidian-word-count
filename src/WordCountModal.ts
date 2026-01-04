import { App, Modal } from "obsidian";
import { TextStats, analyzeText } from "./utils";
import { WordCountSettings } from "./settings";

export class WordCountModal extends Modal {
	private documentText: string;
	private selectedText: string;
	private settings: WordCountSettings;

	constructor(app: App, documentText: string, selectedText: string, settings: WordCountSettings) {
		super(app);
		this.documentText = documentText;
		this.selectedText = selectedText;
		this.settings = settings;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass("word-count-modal");

		contentEl.createEl("h2", { text: "Word Count" });

		const analysisOptions = {
			excludeMarkdown: this.settings.excludeMarkdown,
			excludeCodeBlocks: this.settings.excludeCodeBlocks,
		};

		const docStats = analyzeText(this.documentText, analysisOptions);
		this.renderStatsSection(contentEl, "Document", docStats);

		// Handle selection display based on settings
		if (this.settings.showSelectionStats) {
			const hasSelection = this.selectedText && this.selectedText.length > 0;

			if (hasSelection) {
				const selStats = analyzeText(this.selectedText, analysisOptions);
				this.renderStatsSection(contentEl, "Selection", selStats);
			} else if (!this.settings.onlyShowSelectionWhenActive) {
				// Show empty selection stats
				this.renderStatsSection(contentEl, "Selection", {
					words: 0,
					charsWithSpaces: 0,
					charsWithoutSpaces: 0,
					charsWithoutPunctuation: 0,
				});
			}
		}
	}

	private renderStatsSection(container: HTMLElement, title: string, stats: TextStats) {
		const section = container.createDiv({ cls: "word-count-section" });
		section.createEl("h3", { text: title });

		const table = section.createEl("table", { cls: "word-count-table" });

		if (this.settings.showWords) {
			this.addRow(table, "Words", stats.words.toLocaleString());
		}
		if (this.settings.showCharsWithSpaces) {
			this.addRow(table, "Characters (with spaces)", stats.charsWithSpaces.toLocaleString());
		}
		if (this.settings.showCharsWithoutSpaces) {
			this.addRow(table, "Characters (without spaces)", stats.charsWithoutSpaces.toLocaleString());
		}
		if (this.settings.showCharsWithoutPunctuation) {
			this.addRow(table, "Characters (without punctuation)", stats.charsWithoutPunctuation.toLocaleString());
		}
	}

	private addRow(table: HTMLTableElement, label: string, value: string) {
		const row = table.createEl("tr");
		row.createEl("td", { text: label, cls: "word-count-label" });
		row.createEl("td", { text: value, cls: "word-count-value" });
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
