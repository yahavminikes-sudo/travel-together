import React from 'react';

export const AvatarSize = {
  SMALL: 32,
  MEDIUM: 48,
  LARGE: 64,
  EXTRA_LARGE: 96
} as const;

export type AvatarSize = (typeof AvatarSize)[keyof typeof AvatarSize];

export interface CustomAvatarProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  size?: AvatarSize;
  imageUrl?: string;
  altText?: string;
  fallback?: string;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({
  size = AvatarSize.MEDIUM,
  imageUrl,
  altText = 'Avatar',
  fallback,
  className,
  ...props
}) => {
  return !imageUrl ? (
    <div
      className={`d-inline-flex align-items-center justify-content-center bg-secondary text-white rounded-circle ${className || ''}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {fallback ? fallback.charAt(0).toUpperCase() : '?'}
    </div>
  ) : (
    <img
      src={imageUrl}
      alt={altText}
      className={`rounded-circle object-fit-cover ${className || ''}`}
      style={{ width: size, height: size }}
      {...props}
    />
  );
};
