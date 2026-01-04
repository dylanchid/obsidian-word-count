import { App, PluginSettingTab, Setting } from "obsidian";
import type WordCountPlugin from "./main";

export interface WordCountSettings {
	// Metric toggles
	showWords: boolean;
	showCharsWithSpaces: boolean;
	showCharsWithoutSpaces: boolean;
	showCharsWithoutPunctuation: boolean;

	// Display options
	showSidebarOnStartup: boolean;
	sidebarPosition: "left" | "right";
	showRibbonIcon: boolean;

	// Counting behavior
	excludeMarkdown: boolean;
	excludeCodeBlocks: boolean;

	// Selection display
	showSelectionStats: boolean;
	onlyShowSelectionWhenActive: boolean;
}

export const DEFAULT_SETTINGS: WordCountSettings = {
	// Metric toggles
	showWords: true,
	showCharsWithSpaces: true,
	showCharsWithoutSpaces: true,
	showCharsWithoutPunctuation: true,

	// Display options
	showSidebarOnStartup: false,
	sidebarPosition: "right",
	showRibbonIcon: true,

	// Counting behavior
	excludeMarkdown: false,
	excludeCodeBlocks: false,

	// Selection display
	showSelectionStats: true,
	onlyShowSelectionWhenActive: true,
};

export class WordCountSettingTab extends PluginSettingTab {
	plugin: WordCountPlugin;

	constructor(app: App, plugin: WordCountPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Main title
		containerEl.createEl("h1", { text: "Wordcount+ settings" });

		// Metrics Section
		containerEl.createEl("h3", { text: "Metrics" });

		new Setting(containerEl)
			.setName("Show word count")
			.setDesc("Display the word count statistic")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showWords)
					.onChange(async (value) => {
						this.plugin.settings.showWords = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show characters (with spaces)")
			.setDesc("Display character count including spaces")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showCharsWithSpaces)
					.onChange(async (value) => {
						this.plugin.settings.showCharsWithSpaces = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show characters (without spaces)")
			.setDesc("Display character count excluding spaces")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showCharsWithoutSpaces)
					.onChange(async (value) => {
						this.plugin.settings.showCharsWithoutSpaces = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show characters (without punctuation)")
			.setDesc("Display character count excluding punctuation and spaces")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showCharsWithoutPunctuation)
					.onChange(async (value) => {
						this.plugin.settings.showCharsWithoutPunctuation = value;
						await this.plugin.saveSettings();
					})
			);

		// Display Section
		containerEl.createEl("h3", { text: "Display" });

		new Setting(containerEl)
			.setName("Show sidebar on startup")
			.setDesc("Automatically open the word count sidebar when Obsidian starts")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showSidebarOnStartup)
					.onChange(async (value) => {
						this.plugin.settings.showSidebarOnStartup = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Sidebar position")
			.setDesc("Which side to open the word count sidebar")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("left", "Left")
					.addOption("right", "Right")
					.setValue(this.plugin.settings.sidebarPosition)
					.onChange(async (value: "left" | "right") => {
						this.plugin.settings.sidebarPosition = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show ribbon icon")
			.setDesc("Show the word count icon in the left ribbon (requires restart)")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showRibbonIcon)
					.onChange(async (value) => {
						this.plugin.settings.showRibbonIcon = value;
						await this.plugin.saveSettings();
					})
			);

		// Counting Behavior Section
		containerEl.createEl("h3", { text: "Counting Behavior" });

		new Setting(containerEl)
			.setName("Exclude markdown syntax")
			.setDesc("Strip markdown formatting (headers, bold, links, etc.) before counting")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.excludeMarkdown)
					.onChange(async (value) => {
						this.plugin.settings.excludeMarkdown = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Exclude code blocks")
			.setDesc("Exclude fenced code blocks (```) from counts")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.excludeCodeBlocks)
					.onChange(async (value) => {
						this.plugin.settings.excludeCodeBlocks = value;
						await this.plugin.saveSettings();
					})
			);

		// Selection Section
		containerEl.createEl("h3", { text: "Selection" });

		new Setting(containerEl)
			.setName("Show selection stats")
			.setDesc("Display statistics for selected text")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showSelectionStats)
					.onChange(async (value) => {
						this.plugin.settings.showSelectionStats = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Only show selection when active")
			.setDesc("Hide the selection section when no text is selected")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.onlyShowSelectionWhenActive)
					.onChange(async (value) => {
						this.plugin.settings.onlyShowSelectionWhenActive = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
