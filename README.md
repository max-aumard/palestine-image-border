# 🇵🇸 Palestine Image Border

Add a Palestine flag-colored border to your profile picture — free, private, and instant.

**[Try it now →](https://max-aumard.github.io/palestine-image-border/)**

![Palestine Image Border Preview](assets/preview.png)

## Features

- **100% Private** — Your images never leave your browser. Zero server uploads, zero tracking.
- **Free Forever** — No subscriptions, no watermarks, no hidden costs.
- **Instant Results** — Client-side processing powered by Canvas API.
- **Customizable** — Adjust border width and choose between circle or square frames.
- **Easy to Use** — Drag & drop your photo, crop it, and download the result.

## How It Works

1. **Upload** your profile picture (PNG, JPG, WebP)
2. **Crop** it to your preferred framing (1:1 aspect ratio)
3. **Customize** the border width and frame shape
4. **Download** your new profile picture with the Palestine flag border

The Palestine flag colors (black, white, green, red) are arranged around your photo as a circular or square frame.

## Privacy First

This tool runs **100% in your browser**. Your images are processed locally using the Canvas API and never uploaded to any server. No cookies, no analytics, no data collection.

## Tech Stack

- **Vanilla JavaScript** — No frameworks, no build step
- **Canvas API** — For rendering the flag border
- **Cropper.js** — Interactive image cropping
- **HTML5 FileReader** — Client-side image loading
- **Responsive CSS** — Mobile-first design

## Local Development

No build process required. Just serve the static files:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Deployment

### GitHub Pages (Recommended)

1. Push your code to GitHub
2. Go to **Settings** → **Pages**
3. Set source to **Deploy from a branch**
4. Select branch: `main` (or `master`) and folder: `/ (root)`
5. Save and wait a few minutes

Your site will be available at `https://yourusername.github.io/palestine-image-border/`

### Docker Deployment

Build and run with Docker:

```bash
docker build -t palestine-border .
docker run -d -p 8080:80 palestine-border
```

Access at `http://localhost:8080`

### VPS / Self-Hosted

Upload the files to any static web server (Apache, Nginx, Caddy, etc.) and serve them.

Example Nginx config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/palestine-border;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## File Structure

```
palestine-image-border/
├── index.html          # Single-page application
├── css/
│   └── style.css       # Responsive styles
├── js/
│   ├── app.js          # Main app logic & UI orchestration
│   ├── canvas.js       # Canvas rendering & border drawing
│   └── crop.js         # Image cropping (Cropper.js integration)
├── assets/
│   └── preview.png     # Social sharing preview image
├── Dockerfile          # Docker container config
├── nginx.conf          # Nginx config for Docker
└── README.md
```

## Flag Color Reference

The Palestine flag colors used in this project:

- **Black**: `#000000`
- **White**: `#FFFFFF`
- **Green**: `#009736`
- **Red**: `#CE1126`

## Browser Support

Works in all modern browsers that support:
- Canvas API
- FileReader API
- ES6+ JavaScript

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Feel free to:

- Report bugs via [GitHub Issues](https://github.com/max-aumard/palestine-image-border/issues)
- Submit pull requests with improvements
- Suggest new features or enhancements

## Roadmap

- [ ] Multiple flag border styles and color arrangements
- [ ] Custom text overlay support ("Free Palestine", etc.)
- [ ] PWA support for offline usage
- [ ] Internationalization (Arabic, French, Spanish)
- [ ] Web Share API integration
- [ ] Batch processing for multiple images

## License

MIT License — see [LICENSE](LICENSE) file for details.

## Support Palestine

This tool is a small gesture of solidarity with the Palestinian people. To make a real impact:

- **Educate yourself** about the history and current situation
- **Speak up** for justice and human rights
- **Support** humanitarian organizations working in Palestine
- **Amplify** Palestinian voices and stories

## Credits

Built with:
- [Cropper.js](https://github.com/fengyuanchen/cropperjs) by Fengyuan Chen
- Icons from [Feather Icons](https://feathericons.com/)

---

Made with solidarity 🇵🇸 | [GitHub](https://github.com/max-aumard/palestine-image-border)
