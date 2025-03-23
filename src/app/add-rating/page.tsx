"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getTeachers, addRating, addTeacher } from '@/lib/db';
import { Teacher, CLASS_TYPES, STUDIO_LOCATIONS } from '@/lib/types';

export default function AddRatingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTeacherId = searchParams.get('teacherId');
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    teacherId: initialTeacherId || '',
    teacherName: '',
    classType: CLASS_TYPES[0],
    studioLocation: STUDIO_LOCATIONS[0],
    overallRating: 3,
    intensity: 3,
    flow: 3,
    energy: 3,
    music: 3,
    notes: '',
    isFavorite: false,
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewTeacherForm, setShowNewTeacherForm] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [newTeacherData, setNewTeacherData] = useState({
    name: '',
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setTeachers(getTeachers());
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (initialTeacherId) {
      const selectedTeacher = teachers.find(t => t.id === initialTeacherId);
      if (selectedTeacher) {
        setFormData(prev => ({
          ...prev,
          teacherId: selectedTeacher.id,
          teacherName: selectedTeacher.name
        }));
      }
    }
  }, [initialTeacherId, teachers]);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
      
      // Show "Add New Teacher" option if no exact matches found
      if (filtered.length === 0 || !filtered.some(t => t.name.toLowerCase() === searchTerm.toLowerCase())) {
        setShowNewTeacherForm(true);
      } else {
        setShowNewTeacherForm(false);
      }
    } else {
      setFilteredTeachers(teachers);
      setShowNewTeacherForm(false);
    }
  }, [searchTerm, teachers]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFavoriteToggle = () => {
    setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };
  
  const handleTeacherSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };
  
  const handleTeacherSelect = (teacher: Teacher) => {
    setFormData(prev => ({
      ...prev,
      teacherId: teacher.id,
      teacherName: teacher.name
    }));
    setSearchTerm(teacher.name);
    setShowDropdown(false);
  };
  
  const handleNewTeacherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeacherData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddNewTeacher = () => {
    if (!newTeacherData.name.trim()) {
      alert('Please enter a teacher name');
      return;
    }
    
    const newTeacher = addTeacher({
      ...newTeacherData,
      name: newTeacherData.name || searchTerm
    });
    
    setTeachers(prev => [...prev, newTeacher]);
    setFormData(prev => ({ 
      ...prev, 
      teacherId: newTeacher.id,
      teacherName: newTeacher.name
    }));
    setShowNewTeacherForm(false);
    setSearchTerm(newTeacher.name);
    setShowDropdown(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teacherId) {
      alert('Please select a teacher');
      return;
    }
    
    if (!formData.classType) {
      alert('Please select a class type');
      return;
    }
    
    if (!formData.studioLocation) {
      alert('Please enter a studio location');
      return;
    }
    
    addRating({
      teacherId: formData.teacherId,
      classType: formData.classType,
      studioLocation: formData.studioLocation,
      overallRating: formData.overallRating,
      dimensions: {
        intensity: formData.intensity,
        flow: formData.flow,
        energy: formData.energy,
        music: formData.music,
      },
      notes: formData.notes,
      isFavorite: formData.isFavorite,
    });
    
    // Redirect to the teacher's page
    router.push(`/teachers/${formData.teacherId}`);
  };
  
  // Star rating component
  const RatingInput = ({ 
    name, 
    value, 
    onChange, 
    label,
    description
  }: { 
    name: string; 
    value: number; 
    onChange: (name: string, value: number) => void;
    label: string;
    description?: string;
  }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          {label}
          {description && <span className="text-sm text-gray-500 ml-2">({description})</span>}
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(name, star)}
              className={`text-2xl ${star <= value ? 'text-yellow-500' : 'text-gray-300'} focus:outline-none`}
              aria-label={`${star} stars`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-gray-600">{value}/5</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">Rate a Yoga Teacher</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Teacher Search/Selection */}
          <div className="mb-6 relative" ref={dropdownRef}>
            <label htmlFor="teacherSearch" className="block text-gray-700 mb-2">
              Select or Search for Teacher
            </label>
            <div className="relative">
              <input
                id="teacherSearch"
                type="text"
                value={searchTerm}
                onChange={handleTeacherSearch}
                onClick={() => setShowDropdown(true)}
                className="w-full p-2 border rounded"
                placeholder="Click to select or type to search..."
              />
              {formData.teacherId && !showDropdown && (
                <div className="absolute right-2 top-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, teacherId: '', teacherName: '' }));
                      setSearchTerm('');
                    }}
                    className="text-sm text-blue-500"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Filtered teacher list */}
                {filteredTeachers.length > 0 ? (
                  <ul className="py-1">
                    {filteredTeachers.map(teacher => (
                      <li 
                        key={teacher.id}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
                        onClick={() => handleTeacherSelect(teacher)}
                      >
                        <div className="font-medium">{teacher.name}</div>
                      </li>
                    ))}
                  </ul>
                ) : searchTerm ? (
                  <div className="p-4 text-gray-500 text-center">No teachers found</div>
                ) : (
                  <ul className="py-1">
                    {teachers.map(teacher => (
                      <li 
                        key={teacher.id}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition"
                        onClick={() => handleTeacherSelect(teacher)}
                      >
                        <div className="font-medium">{teacher.name}</div>
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Add new teacher option */}
                {showNewTeacherForm && (
                  <div className="border-t mt-2">
                    <div className="p-4">
                      <h3 className="font-semibold mb-3 text-blue-600">Add New Teacher</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={newTeacherData.name || searchTerm}
                            onChange={handleNewTeacherChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddNewTeacher}
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full"
                        >
                          Add Teacher
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {formData.teacherId && !showDropdown && (
              <div className="mt-2 p-2 bg-blue-50 border rounded">
                <span>Selected: <strong>{formData.teacherName}</strong></span>
              </div>
            )}
          </div>
          
          {/* Class Type Selection */}
          <div className="mb-4">
            <label htmlFor="classType" className="block text-gray-700 mb-2">
              Class Type
            </label>
            <select
              id="classType"
              name="classType"
              value={formData.classType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {CLASS_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Studio Location */}
          <div className="mb-6">
            <label htmlFor="studioLocation" className="block text-gray-700 mb-2">
              Studio Location
            </label>
            <select
              id="studioLocation"
              name="studioLocation"
              value={formData.studioLocation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {STUDIO_LOCATIONS.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          {/* Overall Rating */}
          <RatingInput
            name="overallRating"
            value={formData.overallRating}
            onChange={handleRatingChange}
            label="Overall Rating"
          />
          
          {/* Dimensions */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Dimensions</h3>
            
            <RatingInput
              name="intensity"
              value={formData.intensity}
              onChange={handleRatingChange}
              label="Intensity"
              description="Yoga (1) to Workout (5)"
            />
            
            <RatingInput
              name="flow"
              value={formData.flow}
              onChange={handleRatingChange}
              label="Flow"
            />
            
            <RatingInput
              name="energy"
              value={formData.energy}
              onChange={handleRatingChange}
              label="Energy"
            />
            
            <RatingInput
              name="music"
              value={formData.music}
              onChange={handleRatingChange}
              label="Music"
            />
          </div>
          
          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded"
              placeholder="Share your experience..."
            />
          </div>
          
          {/* Favorite Toggle */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={handleFavoriteToggle}
                className="sr-only"
              />
              <span
                className={`text-2xl mr-2 ${formData.isFavorite ? 'text-red-500' : 'text-gray-300'}`}
              >
                ♥
              </span>
              <span>Add to Favorites</span>
            </label>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}