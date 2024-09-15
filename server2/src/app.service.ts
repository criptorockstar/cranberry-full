// app.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class AppService {
  async getFileByName(fileName: string, res: Response) {
    const filePath = join(process.cwd(), 'public', fileName);

    // Verifica si el archivo existe
    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }

    // Lee el archivo original
    const file = fs.readFileSync(filePath);

    // Redimensiona la imagen
    try {
      const resizedImage = await sharp(file)
        .resize({ width: 115, height: 68 }) // Ajusta el tamaño según sea necesario
        .toBuffer();

      // Establece el tipo de contenido y envía la imagen redimensionada
      res.set('Content-Type', 'image/jpeg'); // Ajusta el tipo de contenido según la imagen
      res.send(resizedImage);
    } catch (error) {
      res.status(500).send('Error processing image');
    }
  }
}
