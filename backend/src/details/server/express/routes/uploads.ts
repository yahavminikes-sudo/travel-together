import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { createUploadController } from '../controllers/uploadController';

const maxUploadSizeBytes = 5 * 1024 * 1024;
const payloadTooLargeStatusCode = 413;
const supportedMimeTypes = new Set(['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const unsupportedImageTypeMessage = 'Unsupported image type. Use PNG, JPG, WEBP, or GIF.';
const imageTooLargeMessage = 'Image is too large. Please upload a file smaller than 5 MB.';

const upload = multer({
  fileFilter: (_req, file, callback) => {
    if (!supportedMimeTypes.has(file.mimetype)) {
      callback(new Error(unsupportedImageTypeMessage));
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: maxUploadSizeBytes,
    files: 1
  },
  storage: multer.memoryStorage()
});

const handleUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(payloadTooLargeStatusCode).json({ message: imageTooLargeMessage });
      return;
    }

    if (error.message === unsupportedImageTypeMessage) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: unsupportedImageTypeMessage });
      return;
    }

    next(error);
  });
};

export const createUploadRouter = (
  uploadController: ReturnType<typeof createUploadController>,
  authenticate: RequestHandler
) => {
  const router = Router();

  router.post('/image', authenticate, handleUpload, uploadController.uploadImage);

  return router;
};
