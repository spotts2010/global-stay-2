// src/components/share/share-button.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MdShare, MdMail } from 'react-icons/md';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

interface ShareButtonProps {
  /** The title of the item being shared (e.g., listing name or unit name) */
  title: string;
  /** Optional specific URL to share. Defaults to current window location. */
  url?: string;
}

/**
 * A reusable Share button that provides options to share via social networks, WhatsApp, and Email.
 * Uses local brand teal styling and captures the share URL safely on the client side.
 */
export default function ShareButton({ title, url }: ShareButtonProps) {
  const [shareUrl, setShareUrl] = useState('');

  // Derive the share URL on the client side to avoid hydration mismatches
  useEffect(() => {
    setShareUrl(url || (typeof window !== 'undefined' ? window.location.href : ''));
  }, [url]);

  const shareText = `Check out ${title} on Global Stay 2.0!`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter (X)',
      icon: FaTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Email',
      icon: MdMail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
    },
  ];

  if (!shareUrl) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 bg-[#0DADA3] text-white hover:bg-[#0DADA3]/90 border-none transition-colors"
        >
          <MdShare className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareLinks.map((link) => (
          <DropdownMenuItem key={link.name} asChild>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer w-full"
            >
              <link.icon className="h-4 w-4" />
              <span>{link.name}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
