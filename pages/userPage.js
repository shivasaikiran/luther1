import { useState } from 'react';
import Link from 'next/link';

export default function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Implement your login logic here
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between p-4 text-white bg-gray-800">
        <h1 className="text-lg font-bold">Profile</h1>
        <div className="flex items-center">
          {isLoggedIn ? (
            <button className="px-4 py-2 mr-2 bg-gray-900 rounded-md">
              My Account
            </button>
          ) : (
            <button className="px-4 py-2 mr-2 bg-blue-500 rounded-md" onClick={handleLogin}>
              Log In
            </button>
          )}
          <button className="px-4 py-2 bg-gray-900 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
fillRule="evenodd"
                d="M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 1h10v7H7V6zm3 8V8l-4-4 4-4v8zm-1 1a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col mb-4 md:flex-row md:justify-between">
          <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="mb-2 text-lg font-bold">Orders</h2>
            <ul className="text-sm list-disc list-inside">
              <li>
                <Link href="/orders/1">
                  <a className="hover:underline">Order #12345</a>
                </Link>
              </li>
              <li>
                <Link href="/orders/2">
                  <a className="hover:underline">Order #67890</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="mb-2 text-lg font-bold">Help Center</h2>
            <ul className="text-sm list-disc list-inside">
              <li>
                <Link href="/help/1">
                  <a className="hover:underline">How to track my order</a>
                </Link>
              </li>
              <li>
                <Link href="/help/2">
                  <a className="hover:underline">Returns and refunds</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-white rounded-md shadow-md">
          <h2 className="mb-2 text-lg font-bold">Wishlist</h2>
          <ul className="text-sm list-disc list-inside">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}