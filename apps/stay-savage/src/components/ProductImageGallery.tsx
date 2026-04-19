'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  url: string;
  altText?: string | null;
}

export function ProductImageGallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[3/4] glass  flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-savage-pitch">
        <Image
          src={images[selected].url}
          alt={images[selected].altText || 'Product image'}
          fill
          className="object-cover"
          priority={selected === 0}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelected(idx)}
              className={`aspect-square relative overflow-hidden bg-savage-pitch border-2 transition-colors ${
                selected === idx ? 'border-accent' : 'border-transparent hover:border-accent/30'
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || 'Thumbnail'}
                fill
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
