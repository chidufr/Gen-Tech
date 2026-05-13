import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getProductBySlug, getProducts, getCategories, formatPrice } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import ProductCTA from '@/components/ProductCTA';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Gen-Tech Kenya`,
    description: product.description || `${product.name} available at Gen-Tech Kenya`,
    openGraph: {
      title: `${product.name} | Gen-Tech Kenya`,
      description: product.description || '',
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = await getProducts({
    categorySlug: product.categories?.slug,
    limit: 4,
  });

  const specs = typeof product.specs === 'object' ? product.specs : {};

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-muted-foreground hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-[#111] rounded-lg overflow-hidden mb-4">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 bg-[#111] rounded overflow-hidden flex-shrink-0 border border-primary/30">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.is_hot_deal && (
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">HOT DEAL</span>
              )}
              {product.is_featured && (
                <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded">FEATURED</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                  <span className="text-green-500 font-semibold">
                    Save {formatPrice(product.original_price - product.price)}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" />
              <span>{product.location}</span>
            </div>

            <p className="text-muted-foreground mb-8">{product.description}</p>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Specifications</h2>
                <div className="bg-[#111] border border-primary/30 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(specs).map(([key, value], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-[#111]' : 'bg-[#0a0a0a]'}>
                          <td className="px-4 py-3 text-muted-foreground font-medium">{key}</td>
                          <td className="px-4 py-3 text-white">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <ProductCTA productName={product.name} productPrice={product.price} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'KES',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />
    </div>
  );
}
