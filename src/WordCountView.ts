import { ItemView, WorkspaceLeaf, MarkdownView } from "obsidian";
import { TextStats, analyzeText } from "./utils";

export const VIEW_TYPE_WORD_COUNT = "word-count-view";

export class WordCountView extends ItemView {
	private contentContainer: HTMLElement | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_WORD_COUNT;
	}

	getDisplayText(): string {
		return "Word Count";
	}

	getIcon(): string {
		return "file-text";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass("word-count-view-container");

		const header = container.createEl("div", { cls: "word-count-header" });
		header.createEl("h4", { text: "Word Count" });

		this.contentContainer = container.createEl("div", { cls: "word-count-content" });
		this.updateStats();
	}

	async onClose() {
		// Cleanup
	}

	public updateStats() {
		if (!this.contentContainer) return;

		this.contentContainer.empty();

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			this.contentContainer.createEl("p", {
				text: "Open a markdown file to see word count.",
				cls: "word-count-empty",
			});
			return;
		}

		const editor = view.editor;
		const documentText = editor.getValue();
		const selectedText = editor.getSelection();

		const docStats = analyzeText(documentText);
		this.renderStatsSection("Document", docStats);

		if (selectedText && selectedText.length > 0) {
			const selStats = analyzeText(selectedText);
			this.renderStatsSection("Selection", selStats);
		}
	}

	private renderStatsSection(title: string, stats: TextStats) {
		if (!this.contentContainer) return;

		const section = this.contentContainer.createDiv({ cls: "word-count-section" });
		section.createEl("h5", { text: title });

		const list = section.createEl("ul", { cls: "word-count-list" });

		this.addListItem(list, "Words", stats.words);
		this.addListItem(list, "Chars (with spaces)", stats.charsWithSpaces);
		this.addListItem(list, "Chars (no spaces)", stats.charsWithoutSpaces);
		this.addListItem(list, "Chars (no punctuation)", stats.charsWithoutPunctuation);
	}

	private addListItem(list: HTMLUListElement, label: string, value: number) {
		const item = list.createEl("li", { cls: "word-count-item" });
		item.createSpan({ text: label, cls: "word-count-label" });
		item.createSpan({ text: value.toLocaleString(), cls: "word-count-value" });
	}
}
