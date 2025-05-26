"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/layout/ModeToggle';
import { 
  Home, Users, Building, FileText, Settings, LogOut, Menu, X,
  LayoutDashboard, Plus, Heart, MessageCircle, User, Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock user data - in a real app, this would come from an authentication provider
const currentUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin', // 'admin', 'agent', or 'user'
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation based on user role
  const navigation = {
    admin: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Properties', href: '/dashboard/properties', icon: Building },
      { name: 'Users', href: '/dashboard/users', icon: Users },
      { name: 'Agents', href: '/dashboard/agents', icon: User },
      { name: 'Reports', href: '/dashboard/reports', icon: FileText },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    agent: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Properties', href: '/dashboard/properties', icon: Building },
      { name: 'Add Property', href: '/dashboard/properties/new', icon: Plus },
      { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageCircle },
      { name: 'Profile', href: '/dashboard/profile', icon: User },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    user: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
      { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageCircle },
      { name: 'Profile', href: '/dashboard/profile', icon: User },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  };

  const userNavigation = navigation[currentUser.role as keyof typeof navigation];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block">RealEstateHub</span>
          </Link>
        </div>

        <div className="flex-1" />

        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Link>
          </Button>

          <ModeToggle />

          <Avatar>
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 mt-16 hidden w-64 border-r bg-background lg:block",
            {
              "lg:w-64": isSidebarOpen,
              "lg:w-20": !isSidebarOpen,
            }
          )}
        >
          <div className="flex h-full flex-col p-2">
            <nav className="space-y-1.5 py-3">
              {userNavigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  asChild
                  className={cn("w-full justify-start", {
                    "justify-center": !isSidebarOpen,
                  })}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-5 w-5" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                </Button>
              ))}
            </nav>

            <div className="mt-auto">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", {
                  "justify-center": !isSidebarOpen,
                })}
                asChild
              >
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  {isSidebarOpen && <span>Back to Website</span>}
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                className={cn("w-full justify-start text-muted-foreground hover:text-destructive", {
                  "justify-center": !isSidebarOpen,
                })}
              >
                <LogOut className="mr-2 h-5 w-5" />
                {isSidebarOpen && <span>Log out</span>}
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <nav className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-6 w-6" />
                  <span className="font-bold">RealEstateHub</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{currentUser.name}</div>
                    <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {userNavigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    asChild
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>

              <div className="mt-8 border-t pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/">
                    <Home className="mr-2 h-5 w-5" />
                    <span>Back to Website</span>
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Log out</span>
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto bg-muted/20 p-4 lg:pl-64",
            {
              "lg:pl-64": isSidebarOpen,
              "lg:pl-20": !isSidebarOpen,
            }
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;