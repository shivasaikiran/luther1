import React, { useState, useEffect } from 'react';
import { auth } from '@/Firebase/config'; // Ensure Firebase is correctly configured
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaBars, FaChevronDown, FaTimes, FaPhoneAlt, FaWrench, FaSignOutAlt,FaQuestionCircle,FaBarcode } from 'react-icons/fa';
import logo from './images/logo.webp';
import Image from 'next/image';
import { IoFlashSharp } from "react-icons/io5";
import { CgTrack } from "react-icons/cg";
import Link from 'next/link'; // Import the Link component from Next.js
import { useSelector } from "react-redux";

import { FaGlobe, FaLanguage } from 'react-icons/fa';
import { BiTargetLock } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import { FaCodeCompare } from "react-icons/fa6";

const Header = () => {
  const cartItems = useSelector((state) => state.cart);
  const wishItems = useSelector((state) => state.wish);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({ about: false, shop: false, vendors: false, blog: false });
   const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  

 
  const toggleDropdown = (menu) => {
    setDropdownOpen(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => !prev); // Toggle profile dropdown visibility
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Check if the user is admin
      if (currentUser && currentUser.email === 'luther@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      // Store user data in localStorage
      if (currentUser) {
        localStorage.setItem('users', JSON.stringify({
          displayName: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
        }));
      } else {
        localStorage.removeItem('user');
      }
    });

    // Retrieve user data from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const handleDropdownItemClick = (item) => {
    setClickedItem(item); // Set the clicked item in state
    setProfileDropdownOpen(false); // Close the profile dropdown
  };
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!event.target.closest('.profile-dropdown')) {
  //       setProfileDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <div>
      {/* Main Header */}
      <header className="hidden py-4 bg-white md:block pl-[30px] pr-[30px]">
        <div className="container flex items-center justify-between px-4 mx-auto">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image src={logo} alt="Logo" className="w-[150px] h-12 bg-black" />
            </Link>
          </div>
           <div className="flex space-x-8">
           <div className="flex space-x-8">
      {/* Location Select */}
      <div className="flex flex-col items-center ml-8">
        <FaGlobe className="w-4 h-4 mt-2 mb-1 text-green-500" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block bg-transparent w-[80px] ml-[26px] "
        >
          <option value="" disabled>location</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
          <option value="au">Australia</option>
        </select>
      </div>

      {/* Language Select */}
      <div className="flex flex-col items-center">
        <FaLanguage className="w-6 h-6 pt-2 mb-1 text-green-500" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="block w-12 ml-[16px] bg-transparent "
        >
          
          <option value="en">Eng</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
    </div>
   
    </div>

          {/* Search and Dropdowns */}
          <div className="relative z-10 flex items-center flex-1 mx-16 left-[0px]">
          <select className="px-4 py-2 border rounded-l-lg h-[40px] w-[150px] border-r-0">
  <option style={{ display: 'none' }}>Categories</option>
  <option>Herbal Salt</option>
  <option>Herbal Prash</option>
  <option>Herbal Drops</option>
  <option>Herbal Soaps</option>
  <option>Herbal Juices</option>
  <option>Herbal Vinegar</option>
  <option>Herbal Capsules</option>
</select>

            <div className="h-[40px] border-r"></div> {/* Line between category and search bar */}
            <input
              type="text"
              className="py-3 pl-4 pr-4 border-t border-b border-r h-[40px] w-[430px]  focus:outline-none "
              placeholder="Search for items..."
            />
            <div className="absolute inset-y-0 pl-4 right-[185px] w-[50px] flex items-center pr-3 pointer-events-none bg-green-500 m-[5px]">
              <FaSearch className="text-white" />
            </div>
            <div className="flex flex-col items-center space-x-2 ml-[40px] pt-2" onClick={toggleProfileDropdown}>
    <FaUser />
    <span>Profile</span>
  </div>
          </div>
          {/* Profile, Wishlist, Cart */}
      
            {/* Profile Dropdown */}
            <div className="relative">
 
  {profileDropdownOpen && (
    <div className="absolute right-[60px] top-[20px] z-50 w-[300px] mt-2 bg-white border rounded shadow-lg">
      <div className="h-full max-w-xs p-4 border-r border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
            <FaUser className="w-8 h-8 text-gray-500" />
            
            
          </div>
          
          
        </div>
        <span className='px-14 '>{user ? ` ${user.displayName || user.email.split('@')[0]}` : ''}</span>
        {user ? (
          <>
          <button onClick={handleSignOut} className="flex items-center block w-full px-4 py-2 text-left text-black border-t border-gray-200 hover:bg-gray-200">
  <FaSignOutAlt className="w-4 h-4 mr-3" />
  <span className="inline-block">Logout</span>
</button>

          </>
        ) : (
          <Link href="/Authoption"  onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
            <FaUser className="w-6 h-6 mr-3" />
            Login/Signup
          </Link>
        )}
        <nav className="mt-4">
          <ul>
          {isAdmin && (
            <li className='mb-4'>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-white transition duration-300 rounded-full shadow-md bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 focus:outline-none">
                  <Link href='/AdminDashboard'>
                    <FaWrench />
                  </Link>
                </button>
              </div>
              </li>
            )}
            <li className="mb-4">
              <Link href="/Cart"  onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
                <FaShoppingCart className="w-4 h-4 mr-3" />
                Cart
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/Wish" onClick={() => handleDropdownItemClick('dashboard')} className="flex items-center px-4 py-2 text-gray-700">
                <FaHeart className="w-4 h-4 mr-3" />
                Wishlist
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/UserDashboard" onClick={() => handleDropdownItemClick('dashboard')} className="flex items-center px-4 py-2 text-gray-700">
                <AiFillProduct className="w-4 h-4 mr-3" />
                Orders
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/trackorder" onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
                <BiTargetLock className="w-4 h-4 mr-3" />
                Track Order
              </Link>
            </li>
            <li className="mb-4">
              <Link href="#" className="flex items-center px-4 py-2 text-gray-700">
                <FaQuestionCircle className="w-4 h-4 mr-3" />
                Help Center
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-8">
          <ul>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-sm text-gray-500">
                FAQs
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-sm text-gray-500">
                About Us
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block px-4 py-2 text-sm text-gray-500">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )}
</div>

{/* Wishlist Link */}
{!isAdmin && (
  <Link href="/Wish" className="relative hover:text-green-500 right-[20px] ">
    <div className="flex flex-col items-center pt-2">
      <FaHeart />
      <span className="ml-1">Wishlist</span>
    </div>
    <span className="absolute top-0 right-[17px] flex items-center justify-center w-4 h-4  -mr-4 text-white bg-red-500 rounded-full">
      {wishItems.length}
    </span>
  </Link>
)}

{/* Cart Link */}
{!isAdmin && (
  <Link href="/Cart" className="relative hover:text-green-500 left-[30px]">
    <div className="flex flex-col items-center pt-2">
      <FaShoppingCart />
      <span className="ml-1">Cart</span>
    </div>
    <span className="absolute top-0 right-[5px] flex items-center justify-center w-4 h-4 -mr-4 mt-0 text-white bg-red-500 rounded-full">
      {cartItems.length}
    </span>
  </Link>
)}
{!isAdmin && (
  <Link href="/Cart" className="relative hover:text-green-500 right-[220px]">
    <div className="flex flex-col items-center pt-2">
      <FaCodeCompare/>
      <span className="ml-1">Compare</span>
    </div>
    
  </Link>
)}


{/* Location and Icons */}
          <div className="items-center hidden space-x-14 md:flex">

            {/* Admin Icon */}
            

          
            
           
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden bg-white border-t border-b border-gray-200 md:block pl-[30px] pr-[30px]">
        <div className="container flex items-center justify-between p-4 mx-auto">
          <div className="relative flex space-x-8">
            <Link href="/" className="font-bold hover:text-green-500">Home</Link>
            <div className="relative group">
              <button onClick={() => toggleDropdown('about')} className="flex items-center font-bold hover:text-green-500 focus:outline-none">
                About <FaChevronDown className="relative ml-2 top-1" />
              </button>
              {dropdownOpen.about && (
                <div className="absolute left-0 z-20 mt-2 bg-white border rounded shadow-lg group-hover:block">
                  <Link href="/about/our-story" className="block px-4 py-2 hover:bg-gray-100">Our Story</Link>
                  <Link href="/about/team" className="block px-4 py-2 hover:bg-gray-100">Team</Link>
                  <Link href="/about/careers" className="block px-4 py-2 hover:bg-gray-100">Careers</Link>
                </div>
              )}
            </div>
            <div className="relative group">
              <button onClick={() => toggleDropdown('shop')} className="flex items-center font-bold hover:text-green-500 focus:outline-none">
                Shop <FaChevronDown className="relative ml-1 top-1" />
              </button>
              {dropdownOpen.shop && (
                <div className="absolute left-0 z-20 mt-2 bg-white border rounded shadow-lg group-hover:block">
                  <Link href="/shop/men" className="block px-4 py-2 hover:bg-gray-100">Men</Link>
                  <Link href="/shop/women" className="block px-4 py-2 hover:bg-gray-100">Women</Link>
                  <Link href="/shop/kids" className="block px-4 py-2 hover:bg-gray-100">Kids</Link>
                </div>
              )}
            </div>
            <div className="relative group">
              <button onClick={() => toggleDropdown('vendors')} className="flex items-center font-bold hover:text-green-500 focus:outline-none">
                Vendors <FaChevronDown className="relative ml-1 top-1" />
              </button>
              {dropdownOpen.vendors && (
                <div className="absolute left-0 z-20 mt-2 bg-white border rounded shadow-lg group-hover:block">
                  <Link href="/vendors/vendor1" className="block px-4 py-2 hover:bg-gray-100">Vendor 1</Link>
                  <Link href="/vendors/vendor2" className="block px-4 py-2 hover:bg-gray-100">Vendor 2</Link>
                  <Link href="/vendors/vendor3" className="block px-4 py-2 hover:bg-gray-100">Vendor 3</Link>
                </div>
              )}
            </div>
            <div className="relative group">
              <button onClick={() => toggleDropdown('blog')} className="flex items-center font-bold hover:text-green-500 focus:outline-none">
                Blog <FaChevronDown className="relative ml-1 top-1" />
              </button>
              {dropdownOpen.blog && (
                <div className="absolute left-0 z-20 mt-2 bg-white border rounded shadow-lg group-hover:block">
                  <Link href="/blog/latest-posts" className="block px-4 py-2 hover:bg-gray-100">Latest Posts</Link>
                  <Link href="/blog/news" className="block px-4 py-2 hover:bg-gray-100">News</Link>
                  <Link href="/blog/events" className="block px-4 py-2 hover:bg-gray-100">Events</Link>
                </div>
              )}
            </div>
            <Link href="/Contact" className="font-bold hover:text-green-500">Contact</Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/flash-sale" className="flex items-center space-x-2 font-bold hover:text-green-500">
              <IoFlashSharp />
              <span>Flash Sale</span>
            </Link>
            <Link href="/todays-deal" className="flex items-center space-x-4">
              <span className='font-bold text-red-700'>Today's Deal</span>
            </Link>
            <div className="flex items-center space-x-2">
              <select className="px-2 pl-[15px] py-1 border rounded-lg focus:outline-none font-semibold w-[70px] h-[30px] bg-green-400 text-white">
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
              </select>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Header */}
      {/* Top Banner */}
   

      {/* Main Header */}
    

      {/* Search Bar */}
     {/* Mobile Header */}
     <header className="relative flex items-center justify-between bg-white md:hidden">
        <div className="flex items-center p-4 space-x-2">
          <Link href="/">
            <Image src={logo} alt="Logo" className="w-[100px] h-12 bg-black" />
          </Link>
        </div>
        <div className="flex items-center p-4 space-x-4">
          <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="relative">
            <FaUser size={24} className="text-gray-500 hover:text-green-500" />
          </button>
          <Link href="/Wish" className="relative">
            <FaHeart size={24} className="text-gray-500 hover:text-green-500" />
            {wishItems.length > 0 && (
              <span className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded-full">{wishItems.length}</span>
            )}
          </Link>
          <Link href="/Cart" className="relative">
            <FaShoppingCart size={24} className="text-gray-500 hover:text-green-500" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 px-1 text-xs text-white bg-red-500 rounded-full">{cartItems.length}</span>
            )}
          </Link>
        </div>

        {/* Profile Dropdown */}
        {profileDropdownOpen && (
          <div className="absolute right-4 top-16 z-50 w-[300px] mt-2 bg-white border rounded shadow-lg profile-dropdown">
            <div className="h-full max-w-xs p-4 border-r border-gray-200 bg-gray-50">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full">
                  <FaUser className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <span className='px-14 '>{user ? ` ${user.displayName || user.email.split('@')[0]}` : ''}</span>
              {user ? (
                <>
                  <button onClick={handleSignOut} className="flex items-center block w-full px-4 py-2 text-left text-black border-t border-gray-200 hover:bg-gray-200">
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    <span className="inline-block">Logout</span>
                  </button>
                </>
              ) : (
                <Link href="/Authoption" onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
                  <FaUser className="w-6 h-6 mr-3" />
                  Login/Signup
                </Link>
              )}
              <nav className="mt-4">
                <ul>
                  {isAdmin && (
                    <li className='mb-4'>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-white transition duration-300 rounded-full shadow-md bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 focus:outline-none">
                          <Link href='/AdminDashboard '>
                            <FaWrench />
                          </Link>
                        </button>
                      </div>
                    </li>
                  )}
                  <li className="mb-4">
                    <Link href="/Cart"onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
                      <FaShoppingCart className="w-4 h-4 mr-3" />
                      Cart
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/Wish"onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
                      <FaHeart className="w-4 h-4 mr-3" />
                      Wishlist
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/UserDashboard"onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
                      <AiFillProduct className="w-4 h-4 mr-3" />
                      Orders
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="/trackorder"onClick={() => handleDropdownItemClick('dashboard')} passHref className="flex items-center px-4 py-2 text-gray-700">
                      <BiTargetLock className="w-4 h-4 mr-3" />
                      Track Order
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link href="#"onClick={() => handleDropdownItemClick('dashboard')} className="flex items-center px-4 py-2 text-gray-700">
                      <FaQuestionCircle className="w-4 h-4 mr-3" />
                      Help Center
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="mt-8">
                <ul>
                  <li className="mb-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-500">
                      FAQs
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-500">
                      About Us
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-500">
                      Terms of Use
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar */}
      <div className="mb-6 bg-white md:hidden">
        <div className="relative flex items-center flex-1 mx-4 space-x-2">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <FaBars size={24} />
          </button>
          <select className="px-4 border rounded-l-lg h-[30px] w-[60px] relative left-4 border-r pb-1 ">
            <option value="all">All</option>
            <option value="category1">Herbal Juices</option>
            <option value="category2">Capsules</option>
            <option value="category3">Vinegar</option>
            <option value="category4">Drops</option>
            <option value="category5">Salt</option>
          </select>
          <div className="h-[40px] border-r"></div> {/* Line between category and search bar */}
          <input
            type="text"
            className="py-2 pl-4 pr-4 border-t border-b border-r h-[30px] w-[280px] focus:outline-none"
            placeholder="Search for items..."
          />
          <div className="absolute inset-y-0 right-[0px] w-[50px] h-[30px] flex items-center pl-4 pointer-events-none bg-green-500 m-[5px]">
            <FaSearch className="text-white" />
          </div>
        </div>
      </div>

      {/* Overlay and Sidebar */}
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity z-auto ${isOpen ? 'block' : 'hidden'}`}></div>
<nav className={`fixed inset-y-0 left-0 w-4/5 bg-white overflow-y-auto transition-transform transform z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
  <div className="flex flex-col p-4 space-y-4">
    <div className="flex justify-end">
      <button onClick={() => setIsOpen(false)} className="focus:outline-none">
        <FaTimes size={24} />
      </button>
    </div>
    <div>
      <button onClick={() => toggleDropdown('about')} className="flex items-center justify-between w-full text-left hover:text-green-500 focus:outline-none">
        About <FaChevronDown />
      </button>
      {dropdownOpen.about && (
        <div className="pl-4">
          <Link href="/about/our-story" className="block py-2 hover:text-green-500">Our Story</Link>
          <Link href="/about/team" className="block py-2 hover:text-green-500">Team</Link>
          <Link href="/about/careers" className="block py-2 hover:text-green-500">Careers</Link>
        </div>
      )}
    </div>
    <div>
      <button onClick={() => toggleDropdown('shop')} className="flex items-center justify-between w-full text-left hover:text-green-500 focus:outline-none">
        Shop <FaChevronDown />
      </button>
      {dropdownOpen.shop && (
        <div className="pl-4">
          <Link href="/shop/men" className="block py-2 hover:text-green-500">Men</Link>
          <Link href="/shop/women" className="block py-2 hover:text-green-500">Women</Link>
          <Link href="/shop/kids" className="block py-2 hover:text-green-500">Kids</Link>
        </div>
      )}
    </div>
    <div>
      <button onClick={() => toggleDropdown('vendors')} className="flex items-center justify-between w-full text-left hover:text-green-500 focus:outline-none">
        Vendors <FaChevronDown />
      </button>
      {dropdownOpen.vendors && (
        <div className="pl-4">
          <Link href="/vendors/vendor1" className="block py-2 hover:text-green-500">Vendor 1</Link>
          <Link href="/vendors/vendor2" className="block py-2 hover:text-green-500">Vendor 2</Link>
          <Link href="/vendors/vendor3" className="block py-2 hover:text-green-500">Vendor 3</Link>
        </div>
      )}
    </div>
    <div>
      <button onClick={() => toggleDropdown('blog')} className="flex items-center justify-between block w-full text-left hover:text-green-500 focus:outline-none">
        Blog <FaChevronDown />
      </button>
      {dropdownOpen.blog && (
        <div className="pl-4">
          <Link href="/blog/latest-posts" className="block py-2 hover:text-green-500">Latest Posts</Link>
          <Link href="/blog/news" className="block py-2 hover:text-green-500">News</Link>
          <Link href="/blog/events" className="block py-2 hover:text-green-500">Events</Link>
        </div>
      )}
    </div>
    <Link href="/contact" className="block py-2 hover:text-green-500">Contact</Link>
    <Link href="/compare" className="block py-2 hover:text-green-500">Compare</Link>
    <Link href="/wishlist" className="block py-2 hover:text-green-500">Wishlist</Link>
    <Link href="/cart" className="block py-2 hover:text-green-500">Cart</Link>
    <Link href="/account" className="block py-2 hover:text-green-500">Account</Link>
  </div>
</nav>

    </div>
  );
};

export default Header;
