import React from 'react';

export interface CustomAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
  imageUrl?: string;
  altText?: string;
  fallback?: string;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({ size = 48, imageUrl, altText = 'Avatar', fallback, className, ...props }) => {
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

export default CustomAvatar;
