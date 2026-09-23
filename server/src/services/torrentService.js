const WebTorrent = require('webtorrent');
const client = new WebTorrent();

class TorrentService {
  /**
   * Streams the largest media file from a torrent magnet URI via HTTP Range requests.
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static streamMagnet(req, res) {
    const magnetURI = req.query.magnet;

    if (!magnetURI) {
      return res.status(400).send('Magnet URI is required');
    }

    // Check if torrent already exists in the client to avoid duplicate downloads
    let torrent = client.get(magnetURI);

    if (torrent) {
      TorrentService.handleTorrentStream(torrent, req, res);
    } else {
      client.add(magnetURI, (newTorrent) => {
        TorrentService.handleTorrentStream(newTorrent, req, res);
      });
    }
  }

  static handleTorrentStream(torrent, req, res) {
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
