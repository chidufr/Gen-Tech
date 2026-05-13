import Link from 'next/link';
import { Smartphone, Headphones, Laptop, Mouse, Home, Tv, Watch, Wifi, Camera } from 'lucide-react';

interface CategoryCardProps {
  category: {
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
  };
}

const iconMap: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="w-12 h-12" />,
  headphones: <Headphones className="w-12 h-12" />,
  laptop: <Laptop className="w-12 h-12" />,
  mouse: <Mouse className="w-12 h-12" />,
  home: <Home className="w-12 h-12" />,
  tv: <Tv className="w-12 h-12" />,
  watch: <Watch className="w-12 h-12" />,
  wifi: <Wifi className="w-12 h-12" />,
  camera: <Camera className="w-12 h-12" />,
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon || ''] || <Smartphone className="w-12 h-12" />;

  return (
    <Link href={`/category/${category.slug}`}>
      <div className="bg-[#111] border border-primary/30 rounded-lg p-6 hover:border-primary transition-all duration-300 h-full flex flex-col">
        <div className="text-primary mb-4">{IconComponent}</div>
        <h3 className="text-white font-semibold text-lg mb-2">{category.name}</h3>
        {category.description && (
          <p className="text-muted-foreground text-sm flex-1 mb-4">{category.description}</p>
        )}
        <span className="text-primary text-sm font-medium hover:underline">Browse Now</span>
      </div>
    </Link>
  );
}
