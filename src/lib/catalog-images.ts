/**
 * Resolve as chaves de imagem do catálogo ("products/<slug>" e "vinyl/<linha>/<cor>")
 * para os arquivos em src/assets, processados pelo pipeline de imagens do Astro.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

type ImageModule = { default: ImageMetadata };

const productFiles = import.meta.glob<ImageModule>('../assets/products/*.png', { eager: true });
const vinylFiles = import.meta.glob<ImageModule>('../assets/vinyl/*/*.jpg', { eager: true });
const photoFiles = import.meta.glob<ImageModule>('../assets/photos/*.jpg', { eager: true });

function toKeyMap(files: Record<string, ImageModule>, prefix: string, ext: string): Map<string, ImageMetadata> {
  const map = new Map<string, ImageMetadata>();
  for (const [path, mod] of Object.entries(files)) {
    const rel = path.split(`/assets/${prefix}/`)[1].replace(new RegExp(`\\.${ext}$`), '');
    map.set(`${prefix}/${rel}`, mod.default);
  }
  return map;
}

const IMAGES = new Map<string, ImageMetadata>([
  ...toKeyMap(productFiles, 'products', 'png'),
  ...toKeyMap(vinylFiles, 'vinyl', 'jpg'),
  ...toKeyMap(photoFiles, 'photos', 'jpg'),
]);

export function catalogImage(key: string): ImageMetadata {
  const image = IMAGES.get(key);
  if (!image) throw new Error(`Imagem do catálogo não encontrada: ${key}`);
  return image;
}

/** URL de uma versão WebP redimensionada, para trocar a imagem no navegador sem novo build. */
export async function catalogImageUrl(key: string, width: number): Promise<string> {
  const result = await getImage({ src: catalogImage(key), width, format: 'webp', quality: 82 });
  return result.src;
}
