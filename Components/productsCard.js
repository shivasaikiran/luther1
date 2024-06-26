import Image from 'next/image';
import juices from '../Components/images/Screenshot_2024-06-25_165233-removebg-preview.png';
import capsules from '../Components/images/Screenshot_2024-06-25_181436-removebg-preview.png';
import drops from '../Components/images/Screenshot_2024-06-26_153147-removebg-preview.png';

const features = [
  {
    img: juices,
    title: "Revitalize with our herbal juices.",
  },
  {
    img: capsules,
    title: "Essential nutrients in every capsule.",
  },
  {
    img: drops,
    title: "Naturally potent, wellness distilled.",
  },
];

const productCard = () => {
  return (
    <div className="py-2">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 p-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center h-[230px] p-4 text-left transition-shadow duration-300 bg-gray-100 rounded-md shadow-md hover:shadow-green-700"
            >
              <div className="flex-grow">
                <h3 className="mb-8 font-semibold">{feature.title}</h3>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4">
                  Shop Now
                </button>
              </div>
              <div className="ml-auto">
                <Image
                  src={feature.img}
                  alt={feature.title}
                  width={200}  // Adjust the width as needed
                  height={200} // Adjust the height as needed
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default productCard;
