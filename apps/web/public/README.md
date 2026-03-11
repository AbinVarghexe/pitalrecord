# Public Assets Directory

This directory contains static assets that are served directly by Next.js.

## Usage

Place static files here that need to be accessible from the root URL:

- Favicon: `favicon.ico`
- Images: `logo.png`, `banner.jpg`, etc.
- Robots: `robots.txt`
- Sitemap: `sitemap.xml`
- Other static files

## Examples

```
public/
├── favicon.ico
├── logo.png
├── robots.txt
└── images/
    └── hero.jpg
```

These files will be accessible at:
- `/favicon.ico`
- `/logo.png`
- `/robots.txt`
- `/images/hero.jpg`

## Note

This directory is automatically copied during Docker builds.
