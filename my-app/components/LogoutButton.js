'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ className = "", variant = "default" }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    sessionStorage.clear();
    
    // Redirect to login page
    router.push('/login?logout=true');
  };

  const variants = {
    default: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md",
    outline: "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200",
    minimal: "text-red-600 hover:text-red-700 hover:underline font-medium transition-colors duration-200",
    icon: "p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
  };

  return (
    <button 
      onClick={handleLogout}
      className={`${variants[variant]} ${className} flex items-center space-x-2`}
      title="Logout"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Logout</span>
    </button>
  );
}