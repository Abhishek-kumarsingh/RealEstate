"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

// Mock data for blog post details
const getBlogPostDetails = (slug: string) => {
  const posts = {
    'first-time-home-buyer-guide': {
      id: 1,
      title: 'Complete Guide for First-Time Home Buyers in 2024',
      slug: 'first-time-home-buyer-guide',
      excerpt: 'Everything you need to know about buying your first home, from budgeting to closing.',
      content: `
        <h2>Getting Started with Home Buying</h2>
        <p>Buying your first home is one of the most significant financial decisions you'll make. This comprehensive guide will walk you through every step of the process, ensuring you're well-prepared for this exciting journey.</p>
        
        <h3>1. Assess Your Financial Readiness</h3>
        <p>Before you start looking at properties, it's crucial to understand your financial situation. Calculate your debt-to-income ratio, check your credit score, and determine how much you can afford for a down payment.</p>
        
        <h3>2. Get Pre-approved for a Mortgage</h3>
        <p>Getting pre-approved gives you a clear picture of your budget and shows sellers that you're a serious buyer. Shop around with different lenders to find the best rates and terms.</p>
        
        <h3>3. Find the Right Real Estate Agent</h3>
        <p>A good agent will guide you through the process, help you find properties that meet your criteria, and negotiate on your behalf. Look for someone with experience in your target area.</p>
        
        <h3>4. Start House Hunting</h3>
        <p>Make a list of your must-haves and nice-to-haves. Consider factors like location, schools, commute times, and future resale value. Don't rush this process – take your time to find the right home.</p>
        
        <h3>5. Make an Offer and Close</h3>
        <p>When you find the right property, your agent will help you make a competitive offer. Once accepted, you'll go through inspections, appraisals, and finally, closing.</p>
      `,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        bio: 'Real Estate Expert with 10+ years of experience helping first-time buyers.',
        role: 'Senior Real Estate Consultant'
      },
      publishedAt: '2024-01-15',
      readTime: '8 min read',
      category: 'Buying Guide',
      tags: ['First Time Buyers', 'Home Buying', 'Real Estate Tips', 'Mortgage'],
      likes: 245,
      comments: 18,
      relatedPosts: [
        {
          id: 2,
          title: 'Understanding Mortgage Types and Rates',
          slug: 'mortgage-types-rates',
          image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg'
        },
        {
          id: 3,
          title: 'Top 10 Questions to Ask Your Real Estate Agent',
          slug: 'questions-real-estate-agent',
          image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'
        }
      ]
    }
  };

  return posts[slug as keyof typeof posts] || posts['first-time-home-buyer-guide'];
};

const BlogDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState(getBlogPostDetails(slug));
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto max-w-4xl">
            <Badge className="mb-4 bg-primary text-primary-foreground">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 section-heading-shadow-strong">
              {post.title}
            </h1>
            <p className="text-lg text-white/90 mb-6 section-heading-shadow">
              {post.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{post.likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments} comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-12 max-w-4xl">
        {/* Author Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{post.author.name}</h3>
                <p className="text-sm text-muted-foreground">{post.author.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{post.author.bio}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                >
                  <Heart className={cn("h-4 w-4 mr-2", liked && "fill-current")} />
                  {liked ? 'Liked' : 'Like'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4 flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <section>
          <SectionHeading
            title="Related Articles"
            subtitle="Continue reading with these related posts"
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {post.relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                <Card className="card-height-compact hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <Button variant="ghost" size="sm" className="mt-4 p-0">
                      Read More →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-12 text-center">
          <Card className="p-8">
            <SectionHeading
              title="Need Expert Advice?"
              subtitle="Get personalized guidance from our real estate professionals"
            />
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Contact Our Experts
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Read More Articles
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailPage;
