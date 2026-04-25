import { POST_IMAGE_MAX_UPLOAD_SIZE_BYTES, POST_IMAGE_MESSAGES } from './postEditor.constants';

export const validatePostImageFile = (file: File | null): string | null => {
  if (!file) {
    return null;
  }

  if (!file.type.startsWith('image/')) {
    return POST_IMAGE_MESSAGES.invalidType;
  }

  if (file.size > POST_IMAGE_MAX_UPLOAD_SIZE_BYTES) {
    return POST_IMAGE_MESSAGES.oversized;
  }

  return null;
};
