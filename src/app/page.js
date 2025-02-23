'use client'

import { useState } from 'react';
import StreamControl from '@/app/components/stream/stream-control.js';

export default function Home() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pi Camera Stream</h1>
      
      <div className="space-y-8">
        <StreamControl 
          isStreaming={isStreaming} 
          setIsStreaming={setIsStreaming}
          error={error}
          setError={setError}
        />
      </div>
    </main>
  );
}
