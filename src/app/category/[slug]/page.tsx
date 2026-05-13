import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const categories = await getCategories();
  const { slug } = await params;
  const category = categories.find((cat) => cat.slug === slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-[#111] border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <p className="text-muted-foreground mt-2">{products.length} products</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No products found in this category.</p>
            <Link href="/" className="text-primary hover:underline">Browse all categories</Link>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12 border-t border-border">
        <h2 className="text-2xl font-bold text-white mb-6">Other Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== params.slug)
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="bg-[#111] border border-primary/30 text-white px-4 py-2 rounded-lg hover:border-primary transition"
              >
                {cat.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
