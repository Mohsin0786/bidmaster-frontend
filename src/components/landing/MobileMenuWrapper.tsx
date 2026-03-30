"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function MobileMenuWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="rounded-md p-2 hover:bg-muted"
      >
        <Menu className="size-5" />
      </button>
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

