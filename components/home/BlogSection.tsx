import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight } from 'lucide-react';
import SectionHeading from '@/components/ui/section-heading';

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "How to Stage Your Home for a Quick Sale",
    excerpt: "Learn the professional secrets to staging your home that will help attract buyers and maximize your selling price.",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    date: "March 15, 2023",
    author: "Jessica Williams",
    slug: "how-to-stage-your-home-for-quick-sale",
  },
  {
    id: 2,
    title: "First-Time Homebuyer's Guide: What You Need to Know",
    excerpt: "Everything you need to know about purchasing your first home, from mortgage pre-approval to closing the deal.",
    image: "https://images.pexels.com/photos/7578988/pexels-photo-7578988.jpeg",
    date: "April 3, 2023",
    author: "Michael Chen",
    slug: "first-time-homebuyer-guide",
  },
  {
    id: 3,
    title: "The Rise of Smart Homes: Features Buyers Want",
    excerpt: "Discover the most sought-after smart home features that today's buyers are looking for in their next property.",
    image: "https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg",
    date: "May 22, 2023",
    author: "Sarah Johnson",
    slug: "rise-of-smart-homes-features-buyers-want",
  },
];

const BlogSection = () => {
  return (
    <section className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
        <SectionHeading
          title="Real Estate Guides & Tips"
          subtitle="Expert advice to help you make informed decisions"
          alignment="left"
        />

        <Link href="/blog" className="mt-4 md:mt-0">
          <Button variant="ghost">
            View All Articles
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Show max 3 cards for laptop size as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 equal-height-grid">
        {blogPosts.slice(0, 3).map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group"
          >
            <article
              className="flex flex-col rounded-xl overflow-hidden bg-card border border-border shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 card-height-tall"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{post.date}</span>
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>

                <div className="mt-auto">
                  <span className="text-primary font-medium inline-flex items-center group-hover:underline">
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;