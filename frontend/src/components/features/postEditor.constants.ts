export const POST_IMAGE_MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export const POST_IMAGE_MESSAGES = {
  invalidType: 'Please choose an image file.',
  missing: 'Please add a cover photo before saving your post.',
  oversized: 'Cover photo is too large. Please choose an image smaller than 5 MB.',
  uploadFailed: 'Failed to upload cover photo.'
} as const;
