"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFavoriteTeachers, getRatingsByTeacher } from '@/lib/db';
import { Teacher } from '@/lib/types';

export default function FavoritesPage() {
  const [favoriteTeachers, setFavoriteTeachers] = useState<Teacher[]>([]);
  
  useEffect(() => {
    setFavoriteTeachers(getFavoriteTeachers());
  }, []);
  
  const getAverageRating = (teacherId: string) => {
    const ratings = getRatingsByTeacher(teacherId);
    if (ratings.length === 0) return null;
    
    const sum = ratings.reduce((acc, rating) => acc + rating.overallRating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  const getFavoriteCount = (teacherId: string) => {
    const ratings = getRatingsByTeacher(teacherId);
    return ratings.filter(r => r.isFavorite).length;
  };
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">My Favorite Teachers</h1>
        
        {favoriteTeachers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">You haven't favorited any teachers yet.</p>
            <Link
              href="/teachers"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Browse Teachers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTeachers.map(teacher => {
              const averageRating = getAverageRating(teacher.id);
              const favoriteCount = getFavoriteCount(teacher.id);
              
              return (
                <Link 
                  key={teacher.id} 
                  href={`/teachers/${teacher.id}`}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="relative">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 aspect-video flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-red-800">{teacher.name.split(' ').map(n => n[0]).join('')}</h2>
                  </div>
                  
                  <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <span>{favoriteCount}</span>
                  </div>
                </div>
                  
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{teacher.name}</h2>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {teacher.studio && <p>{teacher.studio}</p>}
                      {teacher.style && <p>{teacher.style}</p>}
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      {averageRating ? (
                        <>
                          <span className="text-yellow-500 font-bold">{averageRating}</span>
                          <span className="text-yellow-500 ml-1">★</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({getRatingsByTeacher(teacher.id).length} ratings)
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">No ratings yet</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}