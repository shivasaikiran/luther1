// components/FeaturesSection.js

import Image from 'next/image';
import juicecard from '../Components/images/juicescard.png';
import capsulescard from '../Components/images/capsulecard.png';
import dropscard from '../Components/images/dropscard.png';

const productsCard = () => {
  return (
    <div className="px-2 lg:mt-[-100px] mt-[-180px] lg:mb-[150px] lg:py-2 lg:px-8 ">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 ">
          {/* Juices Card */}
          <div className="flex flex-col items-center text-center transition-shadow duration-300 bg-white rounded-md shadow-md hover:shadow-green-700">
            <Image src={juicecard}  className="object-cover rounded-md " alt="Herbal Juices" />
            {/* Example text and button */}
            {/* <h3 className="mb-2 font-semibold">"Revitalize with our herbal juices."</h3>
            <button className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600">
              Shop Now
            </button> */}
          </div>

          {/* Drops Card */}
          <div className="flex flex-col items-center text-center transition-shadow duration-300 bg-white rounded-md shadow-md hover:shadow-green-700">
            <Image src={dropscard} className="object-cover rounded-md" alt="Herbal Drops" />
            {/* Example text and button */}
            {/* <h3 className="mb-2 font-semibold">"Essential nutrients in every capsule."</h3>
            <button className="px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded hover:bg-green-600">
              Shop Now
            </button> */}
          </div>

          {/* Capsules Card */}
          <div className="flex flex-col items-center hidden text-center transition-shadow duration-300 bg-white rounded-md shadow-md hover:shadow-green-700 sm:block">
            <Image src={capsulescard}className="object-cover rounded-md" alt="Herbal Capsules" />
            {/* Example text and button */}
            {/* <h3 className="mb-2 font-semibold">"Naturally potent, wellness distilled."</h3>
            <button className="px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded hover:bg-green-600">
              Shop Now
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default productsCard;
