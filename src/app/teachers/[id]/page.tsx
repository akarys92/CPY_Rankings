"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTeacher, getRatingsByTeacher, toggleFavorite } from '@/lib/db';
import { Teacher, Rating } from '@/lib/types';
import dynamic from 'next/dynamic';

// Dynamically import the chart component to avoid SSR issues
const RatingPieChart = dynamic(
  () => import('@/components/RatingPieChart'),
  { ssr: false }
);

export default function TeacherDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  
  useEffect(() => {
    if (typeof id !== 'string') return;
    
    const teacherData = getTeacher(id);
    if (!teacherData) {
      router.push('/teachers');
      return;
    }
    
    setTeacher(teacherData);
    setRatings(getRatingsByTeacher(id));
  }, [id, router]);
  
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
  
  if (!teacher) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  const getAverageRating = () => {
    if (ratings.length === 0) return null;
    const sum = ratings.reduce((acc, rating) => acc + rating.overallRating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  const getDimensionAverage = (dimension: keyof Rating['dimensions']) => {
    if (ratings.length === 0) return null;
    const sum = ratings.reduce((acc, rating) => acc + rating.dimensions[dimension], 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Group ratings by class type
  const getRatingsByClassType = () => {
    const classTypes = new Set(ratings.map(rating => rating.classType));
    return Array.from(classTypes).map(classType => {
      const classRatings = ratings.filter(rating => rating.classType === classType);
      const avgRating = classRatings.reduce((acc, rating) => acc + rating.overallRating, 0) / classRatings.length;
      return {
        classType,
        count: classRatings.length,
        avgRating: avgRating.toFixed(1),
      };
    });
  };
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/teachers" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Teachers
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{teacher.name}</h1>
            
            <div className="mb-6">
              <div className="flex items-center mb-6">
                <span className="text-lg font-semibold mr-2">Average Rating:</span>
                {getAverageRating() ? (
                  <div className="flex items-center">
                    <span className="text-2xl text-yellow-500 font-bold">{getAverageRating()}</span>
                    <span className="text-2xl text-yellow-500 ml-1">★</span>
                    <span className="text-sm text-gray-500 ml-2">({ratings.length} ratings)</span>
                  </div>
                ) : (
                  <span className="text-gray-500">No ratings yet</span>
                )}
              </div>
              
              {ratings.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Average by Dimension:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between items-center">
                      <span>Intensity:</span>
                      <span>{getDimensionAverage('intensity')} ★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Flow:</span>
                      <span>{getDimensionAverage('flow')} ★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Energy:</span>
                      <span>{getDimensionAverage('energy')} ★</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Music:</span>
                      <span>{getDimensionAverage('music')} ★</span>
                    </div>
                  </div>
                </div>
              )}
              
              {ratings.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dynamic import for client component */}
                  <div className="md:col-span-1">
                    <RatingPieChart 
                      ratings={ratings} 
                      chartType="classType" 
                      title="Classes Taught by Type"
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <RatingPieChart 
                      ratings={ratings} 
                      chartType="studioLocation" 
                      title="Classes by Location"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Link
              href={`/add-rating?teacherId=${teacher.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Rating
            </Link>
          </div>
        </div>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Ratings & Reviews</h2>
          
          {ratings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No ratings yet. Be the first to rate this teacher!</p>
          ) : (
            <div className="space-y-6">
              {ratings.map(rating => (
                <div key={rating.id} className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-2xl text-yellow-500 font-bold">{rating.overallRating}</span>
                        <span className="text-2xl text-yellow-500 ml-1">★</span>
                        <span className="text-sm text-gray-500 ml-3">{formatDate(rating.createdAt)}</span>
                      </div>
                      <div className="text-sm font-medium">
                        <span className="mr-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {rating.classType}
                        </span>
                        <span className="text-gray-600">
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
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 mb-4">
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
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Notes:</h4>
                      <p className="text-gray-700">{rating.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}