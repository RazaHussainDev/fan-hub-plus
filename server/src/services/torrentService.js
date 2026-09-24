let clientInstance = null;

class TorrentService {
  /**
   * Initializes or returns the global WebTorrent client dynamically.
   */
  static async getClient() {
    if (!clientInstance) {
      const { default: WebTorrent } = await import('webtorrent');
      clientInstance = new WebTorrent();
    }
    return clientInstance;
  }

  /**
   * Streams the largest media file from a torrent magnet URI via HTTP Range requests.
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async streamMagnet(req, res) {
    // 1. Strict CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const magnetURI = req.query.magnet;

    if (!magnetURI) {
      return res.status(400).send('Magnet URI is required');
    }

    try {
      const client = await TorrentService.getClient();

      let torrent = await client.get(magnetURI);
      if (!torrent) {
        console.log(`[TorrentService] Connecting to swarm for: ${magnetURI.substring(0, 40)}...`);
        torrent = client.add(magnetURI);
      }

      if (!torrent || typeof torrent.on !== 'function') {
        console.error("Engine failed to initialize torrent object.");
        if (!res.headersSent) {
          return res.status(500).json({ success: false, message: "Engine failure" });
        }
        return;
      }

      // If the torrent is already ready, handle it immediately
      if (torrent.ready) {
        TorrentService.handleTorrentStream(torrent, req, res);
        return;
      }

      let timeoutFired = false;
      
      // 10-second timeout fallback
      const timeoutId = setTimeout(async () => {
        timeoutFired = true;
        console.log(`[TorrentService] Timeout: No peers found for ${magnetURI.substring(0, 40)}`);
        
        try {
          const existingTorrent = await client.get(magnetURI);
          if (existingTorrent) {
            existingTorrent.destroy(); // Safely destroy the torrent instance directly
          }
        } catch (err) {
          console.error("Safely caught torrent removal error:", err.message);
        }
        
        if (!res.headersSent) {
          return res.status(504).json({ success: false, message: "Timeout: No peers found, falling back to iframe." });
        }
      }, 10000);

      torrent.on('ready', () => {
        if (timeoutFired) return;
        clearTimeout(timeoutId);
        console.log(`[TorrentService] Torrent metadata fetched! Starting stream...`);
        TorrentService.handleTorrentStream(torrent, req, res);
      });

      torrent.on('error', (err) => {
        console.error("Torrent Error:", err);
      });

    } catch (error) {
      console.error('[TorrentService] Initialization error:', error.message);
      if (!res.headersSent) {
        res.status(500).send('Failed to initialize WebTorrent engine');
      }
    }
  }

  static handleTorrentStream(torrent, req, res) {
    if (res.headersSent) return;
    
    // Find the largest file (typically the main media file)
    const file = torrent.files.reduce((a, b) => a.length > b.length ? a : b);

    const fileSize = file.length;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const readStream = file.createReadStream({ start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4', // Assuming mp4 for generic browser support
      });

      readStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      file.createReadStream().pipe(res);
    }
  }

  static async transcodeMagnet(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const infoHash = req.query.infoHash;
    if (!infoHash) return res.status(400).send('infoHash is required');

    // we use infoHash as magnet directly since WebTorrent supports it
    const magnetURI = `magnet:?xt=urn:btih:${infoHash}`;
    
    try {
      const client = await TorrentService.getClient();
      let torrent = await client.get(magnetURI);
      
      if (!torrent) {
        console.log(`[TorrentService] Connecting to swarm for transcoding: ${infoHash}...`);
        torrent = client.add(magnetURI);
      }

      if (!torrent || typeof torrent.on !== 'function') {
        return res.status(500).json({ success: false, message: "Engine failure" });
      }

      if (torrent.ready) {
        TorrentService.handleTranscodingStream(torrent, req, res);
        return;
      }

      let timeoutFired = false;
      const timeoutId = setTimeout(async () => {
        timeoutFired = true;
        try {
          const existingTorrent = await client.get(magnetURI);
          if (existingTorrent) existingTorrent.destroy();
        } catch (err) {}
        if (!res.headersSent) res.status(504).send('Gateway Timeout');
      }, 10000);

      torrent.on('ready', () => {
        if (timeoutFired) return;
        clearTimeout(timeoutId);
        TorrentService.handleTranscodingStream(torrent, req, res);
      });
    } catch (error) {
      if (!res.headersSent) res.status(500).send('Transcoding init failed');
    }
  }

  static handleTranscodingStream(torrent, req, res) {
    if (res.headersSent) return;
    const file = torrent.files.reduce((a, b) => a.length > b.length ? a : b);
    
    const ffmpeg = require('fluent-ffmpeg');
    
    // Set the ffmpeg path from the ffmpeg-static package
    const ffmpegPath = require('ffmpeg-static');
    ffmpeg.setFfmpegPath(ffmpegPath);

    res.contentType('application/vnd.apple.mpegurl');
    ffmpeg(file.createReadStream())
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('hls')
      .outputOptions([
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
      ])
      .on('error', (err) => console.log('Transcoding error:', err))
      .pipe(res);
  }
}

module.exports = TorrentService;
