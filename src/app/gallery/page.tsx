'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { useSiteContent } from '@/context/SiteContentContext';

export default function GalleryPage() {
  const { galleryImages } = useSiteContent();
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">
          Our Gallery
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A visual feast of our finest creations and happiest moments. Explore
          the events we've had the honor to be a part of.
        </p>
      </div>

      <div className="mt-16 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryImages.filter(img => img.is_active).sort((a,b) => a.display_order - b.display_order).map((image, index) => (
          <div key={image.id} className="break-inside-avoid">
            <Card className="overflow-hidden group">
              <div className="relative aspect-auto">
                <Image
                  src={image.image_url}
                  alt={image.caption}
                  width={600}
                  height={400 + (index % 3) * 100}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-end">
                    <p className="text-white text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{image.caption}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
