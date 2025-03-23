// Types for our application

export interface Teacher {
  id: string;
  name: string;
}

export interface Rating {
  id: string;
  teacherId: string;
  classType: string; // Sculpt, Yoga 1, Yoga 2, etc.
  studioLocation: string; // Location of the studio
  createdAt: string; // ISO date string
  overallRating: number; // 1-5
  dimensions: {
    intensity: number; // 1-5 (Yoga 1 to Workout 5)
    flow: number; // 1-5
    energy: number; // 1-5
    music: number; // 1-5
  };
  notes?: string;
  isFavorite: boolean;
}

export interface TeacherWithRatings extends Teacher {
  ratings: Rating[];
  averageRating?: number;
}

// Class types available for selection
export const CLASS_TYPES = [
  "Sculpt",
  "Yoga 1",
  "Yoga 2", 
  "Yoga 3",
  "Hot Power Fusion",
  "Strength"
];

// Studio locations available for selection
export const STUDIO_LOCATIONS = [
  "Ballard",
  "Belltown",
  "Capitol Hill",
  "Queen Anne",
  "University District",
  "Bellevue"
];