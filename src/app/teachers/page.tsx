"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTeachers, getRatingsByTeacher } from '@/lib/db';
import { Teacher } from '@/lib/types';

function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadTeachers = () => {
      const allTeachers = getTeachers();
      setTeachers(allTeachers);
    };
    
    loadTeachers();
  }, []);
  
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getAverageRating = (teacherId: string) => {
    const ratings = getRatingsByTeacher(teacherId);
    if (ratings.length === 0) return null;
    
    const sum = ratings.reduce((acc, rating) => acc + rating.overallRating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  return (
    <div className="min-h-screen p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-6">Yoga Teachers</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, studio, or style..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {filteredTeachers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No teachers found. Try another search term.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => {
              const averageRating = getAverageRating(teacher.id);
              
              return (
                <Link 
                  key={teacher.id} 
                  href={`/teachers/${teacher.id}`}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 aspect-video flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-blue-800">{teacher.name.split(' ').map(n => n[0]).join('')}</h2>
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{teacher.name}</h2>
                    
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
      </main>
    </div>
  );
}

// Export a page component that wraps the teachers list in a Suspense boundary
export default function TeachersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <TeachersList />
    </Suspense>
  );
}