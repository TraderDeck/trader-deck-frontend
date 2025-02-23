import { useState, useEffect, useRef } from "react";


interface UserDropdownProps {
  username: string;
  userEmail: string;
  onLogout: () => void;
}

export function UserDropdown({ username, userEmail , onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
        {/* Simple user icon (SVG). Replace with your preferred icon if needed. */}
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
          <div className="p-4 border-b">
            <p className="text-gray-800 font-semibold">User: {username}</p>
            {/* This is a placeholder for the password */}
            <p className="text-gray-600 font-semibold">{userEmail}</p>
          </div>
          <button onClick={onLogout} className="w-full text-center px-4 py-2 font-bold text-dark-green hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
