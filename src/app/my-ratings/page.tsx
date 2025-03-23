"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { getRatings, getTeachers, toggleFavorite } from '@/lib/db';
import { Rating, Teacher } from '@/lib/types';

function MyRatings() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [teachers, setTeachers] = useState<Record<string, Teacher>>({});
  
  useEffect(() => {
    // Load all ratings
    const allRatings = getRatings();
    setRatings(allRatings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    
    // Create a map of teachers for quick lookup
    const teacherList = getTeachers();
    const teacherMap: Record<string, Teacher> = {};
    teacherList.forEach(teacher => {
      teacherMap[teacher.id] = teacher;
    });
    setTeachers(teacherMap);
  }, []);
  
  const handleToggleFavorite = (ratingId: string) => {
    const updatedRating = toggleFavorite(ratingId);
    if (updatedRating) {
      setRatings(prevRatings => 
        prevRatings.map(r => 
          r.id === ratingId ? updatedRating : r
        )
      );
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">My Ratings History</h1>
        
        {ratings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">You haven't rated any teachers yet.</p>
            <Link
              href="/teachers"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Browse Teachers
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ratings.map(rating => {
              const teacher = teachers[rating.teacherId];
              
              if (!teacher) return null;
              
              return (
                <div key={rating.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex justify-between items-center">
                      <Link href={`/teachers/${teacher.id}`} className="text-xl font-semibold hover:text-blue-500">
                        {teacher.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {formatDate(rating.createdAt)}
                      </div>
                    </div>
                    
                    {(teacher.studio || teacher.style) && (
                      <div className="text-sm text-gray-600 mt-1">
                        {teacher.studio && <span>{teacher.studio}</span>}
                        {teacher.studio && teacher.style && <span> • </span>}
                        {teacher.style && <span>{teacher.style}</span>}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center">
                          <span className="text-2xl text-yellow-500 font-bold">
                            {rating.overallRating}
                          </span>
                          <span className="text-2xl text-yellow-500 ml-1">★</span>
                          <span className="text-sm text-gray-500 ml-2">Overall Rating</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {rating.classType}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                            {rating.studioLocation}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleToggleFavorite(rating.id)}
                        className={`text-2xl ${rating.isFavorite ? 'text-red-500' : 'text-gray-300'}`}
                        aria-label={rating.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        ♥
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span>Intensity:</span>
                        <span>{rating.dimensions.intensity} ★</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Flow:</span>
                        <span>{rating.dimensions.flow} ★</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Energy:</span>
                        <span>{rating.dimensions.energy} ★</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Music:</span>
                        <span>{rating.dimensions.music} ★</span>
                      </div>
                    </div>
                    
                    {rating.notes && (
                      <div>
                        <h4 className="font-semibold mb-2">Notes:</h4>
                        <p className="text-gray-700">{rating.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Export a page component that wraps the ratings view in a Suspense boundary
export default function MyRatingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <MyRatings />
    </Suspense>
  );
}