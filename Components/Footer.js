// components/Footer.js

import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaChevronRight, FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import logo from './images/logo.webp';
import amazon from './images/amazon.png'
import flipcart from './images/flipkart.png'


const Footer = () => {
  return (
    <footer className="pt-10 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Contact Info */}
          <div className="col-span-1">
            <Image src={logo} alt="Nest Logo" width={150} height={50} className="mb-4 bg-black" />
          
            <p className="flex items-center mb-2 font-semibold text-gray-500">Experience the essence of pure ingredients. Our products are a testament to our commitment to quality and natural purity.  </p>
            <div className="flex items-center space-x-6">
        
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaFacebook className="mt-3 text-2xl" />
        </a>
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaTwitter className="mt-3 text-2xl" />
        </a>
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaInstagram className="mt-3 text-2xl" />
        </a>
        
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaYoutube className="mt-3 text-2xl" />
        </a>
      </div>
           
          </div>

          {/* Company Links */}
          <div>
            <h3 className="pl-2 mb-4 text-xl font-semibold border-l-[3px] border-black border-solid">Company</h3>
            <ul>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">About Us</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Contact Us</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Privacy Policy</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Terms & Conditions</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Delivery Information</span></Link></li>
              
              {/* <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Support Center</span></Link></li> */}
              {/* <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Careers</span></Link></li> */}
            </ul>
          </div>

          {/* Account Links */}
          {/* <div>
            <h3 className="pl-2 mb-4 text-xl font-semibold border-l-[3px] border-black border-solid">Account</h3>
            <ul>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Sign In</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">View Cart</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">My Wishlist</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Track My Order</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Help Ticket</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Shipping Details</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Compare Products</span></Link></li>
            </ul>
          </div> */}

          {/* Corporate Links */}
          <div>
            <h3 className="pl-2 mb-4 text-xl font-semibold border-l-[3px] border-black border-solid">Our Products</h3>
            <ul>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Herbal Salt</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Herbal Prash</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Herbal Soaps</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Herbal Juices</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Herbal Capsules</span></Link></li>
              {/* <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Herbal Salt</span></Link></li> */}
              {/* <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Herbal Salt</span></Link></li> */}
            </ul>
          </div>

          {/* Popular Links */}
          <div>
            <h3 className="pl-2 mb-4 text-xl font-semibold border-l-[3px] border-black border-solid">Popular</h3>
            <ul>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Hot Deal's</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Flash Sale's</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Visit Store</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Order Details</span></Link></li>
              <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-green-500">Trending Products</span></Link></li>
              {/* <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-gray-800">Tea & Kombucha</span></Link></li> */}
              {/* <li className="flex items-center mb-2"><FaChevronRight className="mr-2 text-gray-500"/><Link href="#"><span className="font-semibold text-gray-500 hover:text-gray-800">Cheese</span></Link></li> */}
            </ul>
          </div>
          
          {/* Contact Us Section */}
          <div className="col-span-1 lg:col-span-1 ">
            <h3 className="pl-2 mb-4 text-xl font-semibold border-l-[3px] border-black border-solid">Contact Us</h3>
            <p className="flex items-center mb-2 font-semibold text-gray-500"><FaPhone className="mr-2 text-white" color=' #22c55e' />+919910212600</p>
            <p className="flex items-center mb-2 font-semibold text-gray-500"><FaEnvelope className="mr-2" color=' #22c55e' />luthergroups4@gmail.com</p>
            <p className="flex items-center mb-2 font-semibold text-gray-500"><FaMapMarkerAlt  className="mr-3" color=' #22c55e' />B-2, Industrial Area, Udyog Kunj, Ghaziabad, Uttar Pradesh</p>
            {/* <div className="flex items-center space-x-6 w-56">
        
        <a href="#" className="text-green-500 hover:text-green-700">
          <Image src={amazon}/>
        </a>
        <a href="#" className="text-green-500 hover:text-green-700">
        <Image src={flipcart}/>
        </a>
        
      </div> */}
            {/* <div className="flex items-center space-x-6">
        
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaFacebook className="mt-3 text-2xl" />
        </a>
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaTwitter className="mt-3 text-2xl" />
        </a>
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaInstagram className="mt-3 text-2xl" />
        </a>
        
        <a href="#" className="text-green-500 hover:text-green-700">
          <FaYoutube className="mt-3 text-2xl" />
        </a>
      </div> */}
            {/* <p className="flex items-center mb-2 font-semibold text-gray-500"><FaClock className="mr-2" color=' #22c55e' /> 10:00 - 18:00, Mon - Sat</p>
            <div className="flex items-center">
            <FaPhoneAlt className="mr-2 text-2xl text-green-500" />
            <div>
              <div className="font-bold text-green-700">1900 - 6666</div>
              <div className="font-semibold text-gray-500">Working 8:00 - 22:00</div>
            </div>
          </div> */}
          </div>
        </div>
        
      </div>
      <div className="flex flex-col items-center justify-between px-6 pt-3 pb-3 mt-8 mb-0 border-t border-green-900 lg:flex-row">
          <div className="flex hidden mb-0 space-x-4 lg:mb-0 md:block">
            <Link href="#"><span className="font-semibold text-green-500">Best prices & offers</span></Link>
            <Link href="#"><span className="font-semibold text-green-500">Free delivery</span></Link>
            <Link href="#"><span className="font-semibold text-green-500">Great daily deal</span></Link>
            
          
          </div>
          <div className="pt-0 ">
          <div className="container px-4 mx-auto font-bold text-center text-green-500">
  copyright © {new Date().getFullYear()} LUTHER, All Rights Reserved | <a href="https://www.webroj.com" target="_blank" rel="noopener noreferrer">www.webroj.com</a>
</div>

      </div>
          <div className="flex hidden space-x-4 md:block">
            <Link href="#"><span className="font-semibold text-green-500">Privacy Policy</span></Link>
            <Link href="#"><span className="font-semibold text-green-500">Terms of Use</span></Link>
          </div>
          
        </div>
      
    
    </footer>
  );
}

export default Footer;
