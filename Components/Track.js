// components/FeaturesSection.js

import { FaTags, FaShippingFast, FaDollarSign, FaUndo } from 'react-icons/fa';

const features = [
  {
    icon: <FaTags className="mb-2 text-3xl text-green-500" />,
    title: 'Best prices & offers',
    description: 'Orders $50 or more',
  },
  {
    icon: <FaShippingFast className="mb-2 text-3xl text-green-500" />,
    title: 'Free delivery',
    description: '24/7 amazing services',
  },
  {
    icon: <FaDollarSign className="mb-2 text-3xl text-green-500" />,
    title: 'Great daily deal',
    description: 'When you sign up',
  },
  {
    icon: <FaUndo className="mb-2 text-3xl text-green-500" />,
    title: 'Easy returns',
    description: 'Within 30 days',
  },

];

const Track = () => {
  return (
    <div className="py-10 bg-gray-50 lg:mt-[-100px] mt-[80px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 text-center transition-shadow duration-300 bg-white rounded-md shadow-md hover:shadow-green-700"
            >
              {feature.icon}
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Track;
