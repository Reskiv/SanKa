# Blue Circle Game

A tiny macOS C++ game that loads `assets/blue_circle.png`, draws it as an
interactive object, and shows `dont touch me` when the visible circle is
clicked.

The source uses Objective-C++ (`main.mm`) only as the bridge from C++ to the
windowing and drawing APIs already included with macOS, so no game engine or
third-party package is required.

## Build and play

Open Terminal in this folder, then run:

```sh
make run
```

The program looks for the PNG in `assets/` beside the executable. Keep that
folder in place when moving the game.

To recreate the PNG from the included deterministic asset source, run
`make asset`.

Run `make test` for a non-visual check of PNG loading, circular hit-testing,
and the exact response text.

## Behavior

- The texture is loaded from a real PNG file at startup.
- Only clicks inside the circular area activate it; the transparent corners
  of the image do not.
- Clicking elsewhere does nothing.
