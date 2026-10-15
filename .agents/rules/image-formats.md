# Image Format & Asset Standards

## Rule: WebP Format Exclusivity
- **All images on the website MUST strictly use the `.webp` format.**
- Never use `.jpg`, `.jpeg`, or `.png` for website assets, banners, category cards, editorial components, or product visuals.
- If new image assets are added, generated, or provided in other formats (such as JPG or PNG), they **must immediately be converted to `.webp`** before being referenced in any component, page, or dataset.
- Always delete any raw/intermediate `.jpg`, `.jpeg`, or `.png` files after converting them to `.webp` to keep the public asset directories clean and lightweight.
- Ensure all Next.js `<Image />` tags, CSS backgrounds, and JSON datasets reference `.webp` paths.
