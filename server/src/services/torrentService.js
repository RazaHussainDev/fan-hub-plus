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
      let torrent = client.get(magnetURI);

      if (torrent) {
        if (torrent.ready) {
          TorrentService.handleTorrentStream(torrent, req, res);
        } else {
          torrent.on('ready', () => {
            TorrentService.handleTorrentStream(torrent, req, res);
          });
        }
      } else {
        console.log(`[TorrentService] Connecting to swarm for: ${magnetURI.substring(0, 40)}...`);
        
        let timeoutFired = false;
        
        // 10-second timeout fallback
        const timeoutId = setTimeout(() => {
          timeoutFired = true;
          console.log(`[TorrentService] Timeout: No peers found for ${magnetURI.substring(0, 40)}`);
          client.remove(magnetURI, (err) => {
            if (err) console.error('Error removing torrent:', err);
          });
          if (!res.headersSent) {
            res.status(504).send('Gateway Timeout: Torrent swarm unreachable');
          }
        }, 10000);

        client.add(magnetURI, (newTorrent) => {
          if (timeoutFired) return;
          
          clearTimeout(timeoutId);
          console.log(`[TorrentService] Torrent metadata fetched!`);
          TorrentService.handleTorrentStream(newTorrent, req, res);
        });
      }
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
}

module.exports = TorrentService;
