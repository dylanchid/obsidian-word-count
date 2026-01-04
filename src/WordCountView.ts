import { ItemView, WorkspaceLeaf, MarkdownView } from "obsidian";
import { TextStats, analyzeText } from "./utils";
import type WordCountPlugin from "./main";

export const VIEW_TYPE_WORD_COUNT = "word-count-view";

export class WordCountView extends ItemView {
	private contentContainer: HTMLElement | null = null;
	private plugin: WordCountPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: WordCountPlugin) {
		super(leaf);
		this.plugin = plugin;
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
		const container = this.contentEl;
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

		const { settings } = this.plugin;
		const analysisOptions = {
			excludeMarkdown: settings.excludeMarkdown,
			excludeCodeBlocks: settings.excludeCodeBlocks,
		};

		const docStats = analyzeText(documentText, analysisOptions);
		this.renderStatsSection("Document", docStats);

		// Handle selection display based on settings
		if (settings.showSelectionStats) {
			const hasSelection = selectedText && selectedText.length > 0;

			if (hasSelection) {
				const selStats = analyzeText(selectedText, analysisOptions);
				this.renderStatsSection("Selection", selStats);
			} else if (!settings.onlyShowSelectionWhenActive) {
				// Show empty selection stats
				this.renderStatsSection("Selection", {
					words: 0,
					charsWithSpaces: 0,
					charsWithoutSpaces: 0,
					charsWithoutPunctuation: 0,
				});
			}
		}
	}

	private renderStatsSection(title: string, stats: TextStats) {
		if (!this.contentContainer) return;

		const { settings } = this.plugin;
		const section = this.contentContainer.createDiv({ cls: "word-count-section" });
		section.createEl("h5", { text: title });

		const list = section.createEl("ul", { cls: "word-count-list" });

		if (settings.showWords) {
			this.addListItem(list, "Words", stats.words);
		}
		if (settings.showCharsWithSpaces) {
			this.addListItem(list, "Chars (with spaces)", stats.charsWithSpaces);
		}
		if (settings.showCharsWithoutSpaces) {
			this.addListItem(list, "Chars (no spaces)", stats.charsWithoutSpaces);
		}
		if (settings.showCharsWithoutPunctuation) {
			this.addListItem(list, "Chars (no punctuation)", stats.charsWithoutPunctuation);
		}
	}

	private addListItem(list: HTMLUListElement, label: string, value: number) {
		const item = list.createEl("li", { cls: "word-count-item" });
		item.createSpan({ text: label, cls: "word-count-label" });
		item.createSpan({ text: value.toLocaleString(), cls: "word-count-value" });
	}
}
