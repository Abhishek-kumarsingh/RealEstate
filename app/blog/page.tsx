"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Search, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Complete Guide for First-Time Home Buyers in 2024',
    slug: 'first-time-home-buyer-guide',
    excerpt: 'Everything you need to know about buying your first home, from budgeting to closing.',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    author: 'Sarah Johnson',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Buying Guide',
    featured: true
  },
  {
    id: 2,
    title: 'Understanding Mortgage Types and Interest Rates',
    slug: 'mortgage-types-rates',
    excerpt: 'A comprehensive breakdown of different mortgage options and how to choose the right one.',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
    author: 'Michael Chen',
    publishedAt: '2024-01-12',
    readTime: '6 min read',
    category: 'Finance',
    featured: false
  },
  {
    id: 3,
    title: 'Top 10 Questions to Ask Your Real Estate Agent',
    slug: 'questions-real-estate-agent',
    excerpt: 'Essential questions that will help you find the right agent for your property journey.',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
    author: 'Emily Rodriguez',
    publishedAt: '2024-01-10',
    readTime: '5 min read',
    category: 'Tips',
    featured: false
  },
  {
    id: 4,
    title: 'Real Estate Investment Strategies for Beginners',
    slug: 'investment-strategies-beginners',
    excerpt: 'Learn the fundamentals of real estate investing and build your property portfolio.',
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
    author: 'David Kumar',
    publishedAt: '2024-01-08',
    readTime: '10 min read',
    category: 'Investment',
    featured: true
  },
  {
    id: 5,
    title: 'Home Staging Tips That Actually Work',
    slug: 'home-staging-tips',
    excerpt: 'Professional staging advice to help you sell your property faster and for more money.',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    author: 'Lisa Thompson',
    publishedAt: '2024-01-05',
    readTime: '7 min read',
    category: 'Selling',
    featured: false
  },
  {
    id: 6,
    title: 'Market Trends: What to Expect in 2024',
    slug: 'market-trends-2024',
    excerpt: 'Expert analysis of current market conditions and predictions for the coming year.',
    image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg',
    author: 'Robert Singh',
    publishedAt: '2024-01-03',
    readTime: '9 min read',
    category: 'Market Analysis',
    featured: true
  }
];

const categories = ['All', 'Buying Guide', 'Finance', 'Tips', 'Investment', 'Selling', 'Market Analysis'];

const BlogPage = () => {
  const [posts, setPosts] = useState(blogPosts);
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <SectionHeading
            title="Real Estate Blog"
            subtitle="Expert insights, tips, and guides for your property journey"
            strongShadow={true}
          />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 section-heading-shadow">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="card-height-tall hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6 section-heading-shadow">All Articles</h2>
          
          {regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No articles found matching your criteria.</div>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="card-height-standard hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 group">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16">
          <Card className="p-8 text-center">
            <SectionHeading
              title="Stay Updated"
              subtitle="Get the latest real estate insights delivered to your inbox"
            />
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
