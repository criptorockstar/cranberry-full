import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { readFile, writeFile } from 'fs';
import { extname } from 'path';
import { promisify } from 'util';
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
import sharp from 'sharp';

const multerOptions = {
  storage: diskStorage({
    destination: (_, __, cb) => {
      const uploadDir = './public';

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (_, file, cb) => {
      const name = file.originalname.split('.')[0];
      const extension = extname(file.originalname);
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${name}-${randomName}${extension}`);
    },
  }),
  fileFilter: (_: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, // 2MB
  },
};

export default multerOptions;
