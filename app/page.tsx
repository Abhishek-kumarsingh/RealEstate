import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import CategorySection from '@/components/home/CategorySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      <FeaturedProperties />
      <CategorySection />
      <TestimonialsSection />
      <BlogSection />
    </div>
  );
}