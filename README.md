# Gogoanime and Hianime m3u8 Proxy

A simple proxy server designed to bypass CORS errors when streaming m3u8 content from anime streaming sites like Gogoanime and Hianime.

## Overview

This proxy server solves a common problem when creating anime streaming applications: many anime sites implement CORS restrictions that prevent browsers from directly accessing their m3u8 (HLS - HTTP Live Streaming) manifests and video segments. This proxy acts as a middleman, fetching the content and returning it with proper CORS headers that allow browsers to play the videos without errors.

## Features

- Bypasses CORS restrictions
- Handles URL rewrites in m3u8 files automatically
- Implements caching for better performance
- Works with both m3u8 manifests and video segments (.ts files)
- Ready for deployment on Vercel

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Gogoanime-and-Hianime-proxy.git
   cd Gogoanime-and-Hianime-proxy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Local Development

1. Start the development server:
   ```bash
   npm run dev
   ```
   
2. The server will run at `http://localhost:4040`

### Building for Production

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Deploying to Vercel

This project is configured for deployment on Vercel:

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

## Using the Proxy

To use the proxy, simply make a GET request to the `/m3u8-proxy` endpoint with the `url` parameter set to the m3u8 URL you want to proxy:

```
http://localhost:4040/m3u8-proxy?url=https://example.com/path/to/video.m3u8
```

### Example with a video player:

```javascript
// Using video.js
const player = videojs('my-player');
player.src({
  src: `http://localhost:4040/m3u8-proxy?url=https://example.com/path/to/video.m3u8`,
  type: 'application/x-mpegURL'
});
player.play();
```

```html
<!-- Using HTML5 video with hls.js -->
<video id="video" controls></video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
  const video = document.getElementById('video');
  const videoSrc = `http://localhost:4040/m3u8-proxy?url=https://example.com/path/to/video.m3u8`;
  
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
  } 
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
    video.addEventListener('loadedmetadata', function() {
      video.play();
    });
  }
</script>
```

## Notes

- The proxy automatically handles rewriting URLs in m3u8 files, so any URLs to .ts segments or other m3u8 files will also be proxied.
- The proxy adds a `Referer` header set to "https://megacloud.club/" which may be required by some streaming providers.
- This proxy has a built-in caching mechanism to improve performance.

## Limitations

- Some streaming sites may implement additional security measures beyond CORS which this proxy may not bypass.
- If the m3u8 URLs expire quickly, you may need to obtain fresh URLs before using the proxy.
- The proxy doesn't handle authentication for protected streams.

## Technical Details

The proxy works by:
1. Receiving a request with a URL parameter
2. Fetching the content from the provided URL
3. For m3u8 manifests: transforming the content to rewrite URLs
4. For static files (like .ts segments): directly streaming the content
5. Setting appropriate CORS headers on the response

## License

This project is licensed under the ISC License - see the package.json file for details. 
