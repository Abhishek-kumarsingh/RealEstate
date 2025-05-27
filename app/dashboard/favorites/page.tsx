'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { favoritesApi } from '@/lib/api';
import PropertyCard from '@/components/properties/PropertyCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, Search } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchFavorites();
    }
  }, [user, token]);

  const fetchFavorites = async () => {
    // Skip API call during build or if window is not available (SSR)
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await favoritesApi.getAll(token!);
      setFavorites(response.favorites || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          <p className="text-muted-foreground">
            Properties you've saved for later
          </p>
        </div>
        <Link href="/properties">
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchFavorites}>Try Again</Button>
          </CardContent>
        </Card>
      ) : favorites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start browsing properties and click the heart icon to save your favorites here.
            </p>
            <Link href="/properties">
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
              </CardTitle>
              <CardDescription>
                Properties you've saved for future reference
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property: any) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
