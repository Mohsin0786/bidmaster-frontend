"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "./data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-lg font-bold text-primary">BidMaster</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-md p-2 hover:bg-muted"
        >
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-2 border-t p-4">
        <Button variant="ghost" asChild>
          <Link href="/login" onClick={onClose}>
            Log In
          </Link>
        </Button>
        <Button asChild>
          <Link href="/register" onClick={onClose}>
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}

