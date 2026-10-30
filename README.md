# Word Count

Display word and character counts for the active note and selected text.

## Use

Run **Show word count modal** for a quick count or **Toggle word count sidebar** for a persistent panel. The ribbon button also toggles the panel when enabled. Settings control which metrics appear, whether Markdown and code blocks are counted, and whether the sidebar opens on startup.

## Install manually

Run `npm ci && npm run build`, then copy `manifest.json`, `main.js`, and `styles.css` into `<vault>/.obsidian/plugins/word-count-panel/`. Enable Word Count under **Settings → Community plugins**.

## Develop

Run `npm ci` and `npm run build` from this directory.

## Existing installations

Earlier local builds used the ID `obsidian-word-count`. Before installing this ID, disable the earlier plugin. To retain settings, copy `data.json` from the earlier plugin folder into the new `word-count-panel` folder while Obsidian is closed, then reassign any plugin hotkeys. Keep a backup of the original file until the new installation works.

## License

MIT. See [LICENSE](LICENSE).
