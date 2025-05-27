'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Home, UserPlus, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirect to the intended page or dashboard
      const destination = redirectTo || '/dashboard';
      router.push(destination);
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-6 lg:px-8 py-12 pt-32">
      <div className="w-full max-w-4xl space-y-8">
        {/* Login Card */}
        <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:underline">
                Back to home
              </Link>
            </div>
          </CardFooter>
        </form>
        </Card>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">What would you like to do?</h2>
            <p className="text-muted-foreground">Choose your action after logging in</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* List Property */}
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">List Your Property</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sell or rent your property with our platform. Get maximum exposure to potential buyers.
                </p>
                <Link href="/login?redirect=/submit-property">
                  <Button variant="outline" className="w-full">
                    Login to List Property
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Become Agent */}
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <UserPlus className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Become an Agent</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our network of professional agents. Access premium tools and quality leads.
                </p>
                <Link href="/login?redirect=/become-agent">
                  <Button variant="outline" className="w-full">
                    Login to Apply
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Access */}
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage property listings, agent applications, and platform operations.
                </p>
                <Link href="/login?redirect=/admin">
                  <Button variant="outline" className="w-full">
                    Admin Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
