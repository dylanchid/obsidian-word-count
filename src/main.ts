import { Plugin, MarkdownView } from "obsidian";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { WordCountModal } from "./WordCountModal";
import { WordCountView, VIEW_TYPE_WORD_COUNT } from "./WordCountView";

export default class WordCountPlugin extends Plugin {
	private wordCountView: WordCountView | null = null;

	async onload() {
		// Register the sidebar view
		this.registerView(VIEW_TYPE_WORD_COUNT, (leaf) => {
			this.wordCountView = new WordCountView(leaf);
			return this.wordCountView;
		});

		// Command to open modal (suggested hotkey: Cmd/Ctrl+Shift+C)
		this.addCommand({
			id: "open-word-count-modal",
			name: "Show word count modal",
			callback: () => {
				this.openWordCountModal();
			},
		});

		// Command to toggle sidebar
		this.addCommand({
			id: "toggle-word-count-sidebar",
			name: "Toggle word count sidebar",
			callback: () => {
				this.toggleSidebar();
			},
		});

		// Add ribbon icon to toggle sidebar
		this.addRibbonIcon("file-text", "Word Count", () => {
			this.toggleSidebar();
		});

		// Update sidebar on editor changes
		this.registerEvent(
			this.app.workspace.on("editor-change", () => {
				this.updateSidebarView();
			})
		);

		// Update sidebar on active file change
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.updateSidebarView();
			})
		);

		// Update sidebar on selection change via CodeMirror extension
		this.registerEditorExtension(
			EditorView.updateListener.of((update: ViewUpdate) => {
				if (update.selectionSet) {
					this.updateSidebarView();
				}
			})
		);
	}

	onunload() {
		// Cleanup: detach all leaves with our view
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_WORD_COUNT);
	}

	private openWordCountModal() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			return;
		}

		const editor = view.editor;
		const documentText = editor.getValue();
		const selectedText = editor.getSelection();

		new WordCountModal(this.app, documentText, selectedText).open();
	}

	private async toggleSidebar() {
		const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_WORD_COUNT);

		if (existing.length > 0) {
			// Close existing view
			existing.forEach((leaf) => leaf.detach());
		} else {
			// Open new view in right sidebar
			const leaf = this.app.workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({
					type: VIEW_TYPE_WORD_COUNT,
					active: true,
				});
				this.app.workspace.revealLeaf(leaf);
			}
		}
	}

	private updateSidebarView() {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_WORD_COUNT);
		leaves.forEach((leaf) => {
			const view = leaf.view as WordCountView;
			if (view && view.updateStats) {
				view.updateStats();
			}
		});
	}
}
