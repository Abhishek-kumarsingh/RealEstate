import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import CategorySection from '@/components/home/CategorySection';
import ExploreByAreaSection from '@/components/home/ExploreByAreaSection';
import PremiumListingsSection from '@/components/home/PremiumListingsSection';
import AgentsSection from '@/components/home/AgentsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Latest Properties */}
      <div className="section-spacing px-6 lg:px-8">
        <FeaturedProperties />
      </div>

      {/* Explore by Area/City */}
      <div className="section-spacing px-6 lg:px-8 bg-muted/30">
        <ExploreByAreaSection />
      </div>

      {/* Explore by Type */}
      <div className="section-spacing px-6 lg:px-8">
        <CategorySection />
      </div>

      {/* Premium Listings */}
      <div className="section-spacing px-6 lg:px-8 bg-muted/30">
        <PremiumListingsSection />
      </div>

      {/* Meet Our Agents */}
      <div className="section-spacing px-6 lg:px-8">
        <AgentsSection />
      </div>

      {/* Testimonials */}
      <div className="section-spacing px-6 lg:px-8 bg-muted/30">
        <TestimonialsSection />
      </div>

      {/* Blog/Buyer's Guide */}
      <div className="section-spacing px-6 lg:px-8">
        <BlogSection />
      </div>
    </div>
  );
}