import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import CategorySection from '@/components/home/CategorySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="section-spacing px-6 lg:px-8">
        <FeaturedProperties />
      </div>
      <div className="section-spacing px-6 lg:px-8 bg-muted/30">
        <CategorySection />
      </div>
      <div className="section-spacing px-6 lg:px-8">
        <TestimonialsSection />
      </div>
      <div className="section-spacing px-6 lg:px-8 bg-muted/30">
        <BlogSection />
      </div>
    </div>
  );
}