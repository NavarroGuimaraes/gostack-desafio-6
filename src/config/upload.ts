import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const csvPath = path.resolve(__dirname, '..', '..', 'tmp');
export default {
  directory: csvPath,

  storage: multer.diskStorage({
    destination: csvPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
      // esse null serve para caso dê erro na inserção. Como não estamos tratando o erro, então
      // não vamos fazer nada
    },
  }),
};
