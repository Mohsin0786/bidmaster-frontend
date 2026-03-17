'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Gavel, 
  User, 
  Settings, 
  ChevronRight, 
  PlusCircle,
  TrendingDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isBuyer = user?.roles.includes('Buyer');
  const isSeller = user?.roles.includes('Seller');

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Requirements', href: '/requirements', icon: FileText },
  ];

  if (isBuyer) {
    menuItems.push({ name: 'New Requirement', href: '/requirements/new', icon: PlusCircle });
  }

  if (isSeller) {
    menuItems.push({ name: 'My Bids', href: '/bids', icon: Gavel });
  }

  const bottomItems = [
    { name: 'Profile', href: '/profile', icon: User },
    // { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen border-r bg-background/50 backdrop-blur-xl sticky top-0 left-0 z-50">
      {/* Brand */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl grad-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            BidMaster
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-4">
          Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-5 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                <span className="font-medium">{item.name}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-4 py-6 border-t space-y-2">
        <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-4">
          Account
        </p>
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-secondary text-foreground" 
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
        
        <button 
          onClick={logout}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* User Card */}
      {user && (
        <div className="p-4 bg-muted/30 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-bold truncate leading-none mb-1">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
