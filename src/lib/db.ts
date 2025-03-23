import { Teacher, Rating } from './types';

// Mock database with localStorage
const TEACHERS_KEY = 'yoga-teachers';
const RATINGS_KEY = 'yoga-ratings';

// Sample data
const initialTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
  },
  {
    id: '2',
    name: 'Michael Chen',
  },
  {
    id: '3',
    name: 'Priya Patel',
  },
];

// Initialize the database
export function initDB() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(TEACHERS_KEY)) {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));
  }
  
  if (!localStorage.getItem(RATINGS_KEY)) {
    localStorage.setItem(RATINGS_KEY, JSON.stringify([]));
  }
}

// Teacher functions
export function getTeachers(): Teacher[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TEACHERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTeacher(id: string): Teacher | undefined {
  const teachers = getTeachers();
  return teachers.find(teacher => teacher.id === id);
}

export function addTeacher(teacher: Omit<Teacher, 'id'>): Teacher {
  const teachers = getTeachers();
  const newTeacher = {
    ...teacher,
    id: Date.now().toString(),
  };
  
  localStorage.setItem(TEACHERS_KEY, JSON.stringify([...teachers, newTeacher]));
  return newTeacher;
}

// Rating functions
export function getRatings(): Rating[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(RATINGS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getRatingsByTeacher(teacherId: string): Rating[] {
  const ratings = getRatings();
  return ratings.filter(rating => rating.teacherId === teacherId);
}

export function addRating(rating: Omit<Rating, 'id' | 'createdAt'>): Rating {
  const ratings = getRatings();
  const newRating = {
    ...rating,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(RATINGS_KEY, JSON.stringify([...ratings, newRating]));
  return newRating;
}

export function toggleFavorite(ratingId: string): Rating | undefined {
  const ratings = getRatings();
  const index = ratings.findIndex(r => r.id === ratingId);
  
  if (index === -1) return undefined;
  
  // Toggle favorite status
  ratings[index].isFavorite = !ratings[index].isFavorite;
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  
  return ratings[index];
}

export function getFavoriteTeachers(): Teacher[] {
  const ratings = getRatings();
  const teachers = getTeachers();
  
  // Find teachers with at least one favorited rating
  const favoriteTeacherIds = new Set(
    ratings
      .filter(rating => rating.isFavorite)
      .map(rating => rating.teacherId)
  );
  
  return teachers.filter(teacher => favoriteTeacherIds.has(teacher.id));
}