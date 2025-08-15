'use client';

import { useState, useRef, useEffect } from "react";

// Define types for the categories and their counts
type CategoryCounts = {
  [key: string]: number;
};

type CategoryFiltersProps = {
  categories: string[];
  categoryCounts: CategoryCounts;
  onFilterChange: (selectedCategories: string[]) => void;
};

export default function CategoryFilter({ 
  categories, 
  categoryCounts, 
  onFilterChange 
}: CategoryFiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Track selected categories
  const [selectedCategories, setSelectedCategories] = useState<{[key: string]: boolean}>(
    categories.reduce((acc, category) => ({ ...acc, [category]: true }), {})
  );
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleCategoryChange = (category: string) => {
    const updatedCategories = {
      ...selectedCategories,
      [category]: !selectedCategories[category]
    };
    
    setSelectedCategories(updatedCategories);
    
    // Call the parent component's callback with the currently selected categories
    const filteredCategories = Object.entries(updatedCategories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category);
      
    onFilterChange(filteredCategories);
  };

  return (
    <div className="flex items-center justify-center p-4 relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center rounded-lg bg-[#1d4ed8] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[#1e40af] focus:ring-4 focus:ring-[#93c5fd] focus:outline-none dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] dark:focus:ring-[#1e40af]"
        type="button"
      >
        Filter by category
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 w-56 rounded-lg bg-white p-3 shadow dark:bg-gray-700">
          <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Category
          </h6>
          <ul className="space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category} className="flex items-center">
                <input
                  id={category}
                  type="checkbox"
                  checked={selectedCategories[category] || false}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                />
                <label
                  htmlFor={category}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryCounts[category] || 0})
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}