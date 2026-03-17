'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Menu, 
  Moon, 
  Sun,
  User,
  LogOut,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Simple breadcrumb logic
  const paths = pathname.split('/').filter(Boolean);
  
  return (
    <header className="glass-header h-16 flex items-center justify-between px-6 border-b border-white/10">
      {/* Breadcrumbs / Page Title */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">App</span>
          {paths.map((path, idx) => (
            <React.Fragment key={path}>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <span className={cn(
                "capitalize font-medium",
                idx === paths.length - 1 ? "text-foreground" : "text-muted-foreground"
              )}>
                {path}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-white/5 group focus-within:ring-2 ring-primary/20 transition-all">
          <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search activity..." 
            className="bg-transparent border-none text-sm focus:outline-none w-48"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full border border-white/10 ring-offset-background transition-all hover:scale-105 active:scale-95">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profilePic?.url} alt={user?.firstName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass-card mt-2" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

// Helper inside for simplicity or import if already exists
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Header;
