import GalleryGrid from '@/components/GalleryGrid';
import galleryData from '@/data/gallery.json';

export const metadata = {
  title: 'Galerie - IPJ Los Santos',
  description: 'Galerie foto și video cu evenimente și activități ale Inspectoratului de Poliție Județean Los Santos',
};

export default function GaleriePage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Galerie</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descoperiți momente din activitățile și evenimentele organizate de Inspectoratul de Poliție Județean Los Santos.
          </p>
        </div>

        <GalleryGrid items={galleryData} />

        {galleryData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nu există imagini în galerie momentan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

