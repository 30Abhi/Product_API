import fs from 'fs';
import csv from 'csv-parser';

export function csvParserMiddleware(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const productNames = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      if (row.name) {
        productNames.push(row.name);
      }
    })
    .on('end', () => {
      req.productNames = productNames; // attaching to req

        // console.log(productNames);
      fs.unlinkSync(req.file.path);

      next();
    })
    .on('error', (err) => {
      res.status(500).json({
        error: 'Failed to parse CSV',
        details: err.message
      });
    });
}
