"use client";

import { useEffect } from 'react';
import { initDB } from '@/lib/db';

// Component to initialize the database on client-side
export default function DBInit() {
  useEffect(() => {
    // Initialize the database on client-side
    initDB();
  }, []);
  
  // This component doesn't render anything
  return null;
}