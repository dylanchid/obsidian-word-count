import { App, Modal } from "obsidian";
import { TextStats, analyzeText } from "./utils";

export class WordCountModal extends Modal {
	private documentText: string;
	private selectedText: string;

	constructor(app: App, documentText: string, selectedText: string) {
		super(app);
		this.documentText = documentText;
		this.selectedText = selectedText;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass("word-count-modal");

		contentEl.createEl("h2", { text: "Word Count" });

		const docStats = analyzeText(this.documentText);
		this.renderStatsSection(contentEl, "Document", docStats);

		if (this.selectedText && this.selectedText.length > 0) {
			const selStats = analyzeText(this.selectedText);
			this.renderStatsSection(contentEl, "Selection", selStats);
		}
	}

	private renderStatsSection(container: HTMLElement, title: string, stats: TextStats) {
		const section = container.createDiv({ cls: "word-count-section" });
		section.createEl("h3", { text: title });

		const table = section.createEl("table", { cls: "word-count-table" });

		this.addRow(table, "Words", stats.words.toLocaleString());
		this.addRow(table, "Characters (with spaces)", stats.charsWithSpaces.toLocaleString());
		this.addRow(table, "Characters (without spaces)", stats.charsWithoutSpaces.toLocaleString());
		this.addRow(table, "Characters (without punctuation)", stats.charsWithoutPunctuation.toLocaleString());
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
