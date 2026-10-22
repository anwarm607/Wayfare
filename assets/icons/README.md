# Figma SVG assets

Source: the assignment Figma file, exported through Chrome's Figma Export controls on 22 October 2026. The four complete, unchanged exports are preserved under `docs/figma/`.

These 17 standalone icons retain the original exported paths, strokes, colors, and referenced clip paths. They were separated mechanically from the downloaded SVG layer groups; none were redrawn or replaced with a third-party icon library. `manifest.json` records each source screen, group ID and output geometry.

Each SVG uses a tight viewBox around the original paths with stroke margin. Its root dimensions describe this crop, not the original Figma icon slot or touch target. During implementation, preserve the artwork's aspect ratio within the appropriate source-sized wrapper. Use the original screen export or Figma inspector for slot placement. The brand tile's orange rounded background is a UI container, separate from `brand-route.svg`.

White artwork is intentional for `brand-route`, `destination-pin`, `origin-vehicle`, `traffic-warning`, and `navigation`. Preview it on its intended colored surface. The origin marker is a vehicle/truck symbol in the source.

`docs/figma/icons-preview.html` is a visual inspection sheet. All 17 files were checked in Chrome. Paths and referenced SVG IDs were also checked structurally. The app has not been wired to these assets yet; a small `react-native-svg` component conversion can be done during the relevant implementation step without adding a transformer dependency.

`assets/images/figma/map-source.jpg` and `route-path.svg` are the original embedded map image and separate dashed route vector extracted from the browser export. The original raster format is JPEG.
