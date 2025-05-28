"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/ModeToggle";
import {
  Home,
  Users,
  Building,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Plus,
  Heart,
  MessageCircle,
  User,
  Bell,
  Loader2,
  TrendingUp,
  Brain,
  Calculator,
  DollarSign,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarProvider, useSidebar } from "@/lib/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardContent = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Close mobile menu on larger screens and handle keyboard shortcuts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  // Navigation based on user role
  const navigation = {
    admin: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Properties", href: "/dashboard/properties", icon: Building },
      { name: "Add Property", href: "/dashboard/properties/new", icon: Plus },
      { name: "Users", href: "/dashboard/users", icon: Users },
      { name: "Agents", href: "/dashboard/agents", icon: User },
      { name: "Messages", href: "/dashboard/messages", icon: MessageCircle },
      { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageCircle },
      { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
      { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
      { name: "AI Insights", href: "/dashboard/ai-insights", icon: Brain },
      { name: "Mortgage Calc", href: "/dashboard/mortgage", icon: Calculator },
      { name: "Investment", href: "/dashboard/investment", icon: DollarSign },
      { name: "Documents", href: "/dashboard/documents", icon: FileText },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    agent: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Properties", href: "/dashboard/properties", icon: Building },
      { name: "Add Property", href: "/dashboard/properties/new", icon: Plus },
      { name: "Messages", href: "/dashboard/messages", icon: MessageCircle },
      { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageCircle },
      { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
      { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
      { name: "AI Insights", href: "/dashboard/ai-insights", icon: Brain },
      { name: "Mortgage Calc", href: "/dashboard/mortgage", icon: Calculator },
      { name: "Investment", href: "/dashboard/investment", icon: DollarSign },
      { name: "Documents", href: "/dashboard/documents", icon: FileText },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    user: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
      { name: "Messages", href: "/dashboard/messages", icon: MessageCircle },
      { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageCircle },
      { name: "AI Insights", href: "/dashboard/ai-insights", icon: Brain },
      { name: "Mortgage Calc", href: "/dashboard/mortgage", icon: Calculator },
      { name: "Investment", href: "/dashboard/investment", icon: DollarSign },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  };

  // Use the user role navigation if it exists, otherwise default to user navigation
  const userNavigation =
    navigation[user.role?.toLowerCase() as keyof typeof navigation] ||
    navigation.user;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
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
          {/* Sidebar toggle button for desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex hover:bg-accent transition-colors border border-border/50 relative"
            onClick={toggleSidebar}
            title={`${isSidebarOpen ? "Collapse" : "Expand"} sidebar (Ctrl+B)`}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5 transition-transform" />
            ) : (
              <ChevronRight className="h-5 w-5 transition-transform" />
            )}
            <span className="sr-only">Toggle sidebar</span>
            {/* Status indicator */}
            <div className={cn(
              "absolute -top-1 -right-1 w-2 h-2 rounded-full transition-colors",
              isSidebarOpen ? "bg-green-500" : "bg-orange-500"
            )} />
          </Button>

          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold hidden md:inline-block text-lg">
              RealEstateHub
            </span>
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
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        <aside
          className={cn(
            "fixed top-16 left-0 bottom-0 z-20 hidden border-r bg-background lg:block transition-all duration-300 ease-in-out shadow-lg",
            {
              "lg:w-64": isSidebarOpen,
              "lg:w-20": !isSidebarOpen,
            }
          )}
        >
          <div className="flex h-full flex-col p-2 overflow-hidden">
            <TooltipProvider>
              <nav className="space-y-1.5 py-3">
                {userNavigation.map((item) => (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        asChild
                        className={cn("w-full justify-start transition-all duration-200", {
                          "justify-center": !isSidebarOpen,
                        })}
                      >
                        <Link href={item.href}>
                          <item.icon className={cn("h-5 w-5", {
                            "mr-2": isSidebarOpen,
                            "mr-0": !isSidebarOpen,
                          })} />
                          {isSidebarOpen && <span className="transition-opacity duration-200">{item.name}</span>}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {!isSidebarOpen && (
                      <TooltipContent side="right" className="font-medium">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
            </nav>

              <div className="mt-auto space-y-1.5">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn("w-full justify-start transition-all duration-200", {
                        "justify-center": !isSidebarOpen,
                      })}
                      asChild
                    >
                      <Link href="/">
                        <Home className={cn("h-5 w-5", {
                          "mr-2": isSidebarOpen,
                          "mr-0": !isSidebarOpen,
                        })} />
                        {isSidebarOpen && <span className="transition-opacity duration-200">Back to Website</span>}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {!isSidebarOpen && (
                    <TooltipContent side="right" className="font-medium">
                      Back to Website
                    </TooltipContent>
                  )}
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-muted-foreground hover:text-destructive transition-all duration-200",
                        {
                          "justify-center": !isSidebarOpen,
                        }
                      )}
                      onClick={logout}
                    >
                      <LogOut className={cn("h-5 w-5", {
                        "mr-2": isSidebarOpen,
                        "mr-0": !isSidebarOpen,
                      })} />
                      {isSidebarOpen && <span className="transition-opacity duration-200">Log out</span>}
                    </Button>
                  </TooltipTrigger>
                  {!isSidebarOpen && (
                    <TooltipContent side="right" className="font-medium">
                      Log out
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <nav className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-6 w-6" />
                  <span className="font-bold">RealEstateHub</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
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
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
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
            "flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 transition-all duration-300 ease-in-out min-h-[calc(100vh-4rem)]",
            {
              "lg:ml-64 lg:pl-6": isSidebarOpen,
              "lg:ml-20 lg:pl-6": !isSidebarOpen,
            }
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
};

export default DashboardLayout;
