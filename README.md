# mpv-cards

mpv-cards allows you to automatically create and update Anki cards with minimal setup required.

## Features

- update multiple cards at once (i.e multiple unknown words for a specific set of subtitles)
- fluid card creation for multiple subtitle lines

## Installation

1. Install dependencies with `npm install`. Have (AnkiConnect)[https://github.com/FooSoft/anki-connect] installed in Anki. This also requires `ffmpeg`.
2. Build src files using `npm run build`
3. Copy the distribution file into mpv script directory. Helper script `install.sh` is provided.

## TODO

- makeover the testing suite for more robost development
- better user experience [on-screen-messaging, error catching, etc]

### Heavy influence/hacking together from:

- [mpv-nihongo](https://github.com/pigoz/mpv-nihongo)
- [LaT](https://github.com/pigoz/lat)
- [mpvacious](https://github.com/Ajatt-Tools/mpvacious)
