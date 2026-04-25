import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middlewares/authenticate';

const uploadsDir = path.resolve(process.cwd(), 'uploads');

const mimeToExtension: Record<string, string> = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

export const createUploadController = () => {
  return {
    uploadImage: async (req: AuthRequest, res: Response) => {
      try {
        if (!req.userId) {
          res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
          return;
        }

        if (!req.file) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Image file is required.' });
          return;
        }

        const extension = mimeToExtension[req.file.mimetype];

        if (!extension) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: 'Unsupported image type. Use PNG, JPG, WEBP, or GIF.' });
          return;
        }

        await fs.mkdir(uploadsDir, { recursive: true });

        const fileName = `${randomUUID()}.${extension}`;
        const absolutePath = path.join(uploadsDir, fileName);
        await fs.writeFile(absolutePath, req.file.buffer);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.status(StatusCodes.CREATED).json({
          url: `${baseUrl}/uploads/${fileName}`
        });
      } catch {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to upload image.' });
      }
    }
  };
};
