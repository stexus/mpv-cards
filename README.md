# mpv-cards

mpv-cards allows you to automatically create and update Anki cards with minimal setup required.

## Features

- update multiple cards at once (i.e multiple unknown words for a specific set of subtitles)
- fluid card creation for multiple subtitle lines

## Installation

1. Install dependencies with `npm install`. Have [AnkiConnect](https://github.com/FooSoft/anki-connect) installed in Anki. This also requires `ffmpeg`.
2. Change options as necessary in `src/main.ts`
3. Build src files using `npm run build`
4. Copy the distribution file into mpv script directory. Helper script `install.sh` is provided (Run using `npm run dist`).

## Usage

1. Use [yomichan](https://github.com/FooSoft/yomichan) or other software to add a card.
2. `g` in mpv prompts the user to select between 1-9 lines; press the appropriate number on keyboard.
3. `Alt+g` in mpv prompts the user to select between 1-9 cards to update, then between 1-9 lines.

## Notes

This tool does not grab subtitles that have not been seen yet. In other words, if you've only seen up ton subtitle #1 on mpv, pressing `g` and selecting 3 will still only update the card with only subtitle #1's information. This is intended and I have not seen any significant downsides in everyday usage. I recommend binding keys to navigate subtitles in mpv in any case.

Currently I use this every day, but I'm the only user. If you happen to try it out and find bugs, feel more than free to open an issue or fix it yourself and send a PR!

## TODO

- makeover the testing suite for more robost development. Currently not a great testing setup.
- better user experience [on-screen-messaging, error catching, etc]

### Heavy influence/hacking together from:

- [mpv-nihongo](https://github.com/pigoz/mpv-nihongo)
- [LaT](https://github.com/pigoz/lat)
- [mpvacious](https://github.com/Ajatt-Tools/mpvacious)
