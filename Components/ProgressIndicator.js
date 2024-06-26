import React from 'react';
import { FaBox, FaCheckCircle, FaTruck, FaHome } from 'react-icons/fa';

const ProgressIndicator = ({ status }) => {
  const getStatusStep = (status) => {
    switch (status) {
      case 'Order Placed':
        return 1;
      case 'Packed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0; // Handle other statuses if needed
    }
  };  

  const currentStep = getStatusStep(status);

  const steps = [
    { id: 1, label: 'Order Placed', icon: FaBox },
    { id: 2, label: 'Packed', icon: FaCheckCircle },
    { id: 3, label: 'Shipped', icon: FaTruck },
    { id: 4, label: 'Delivered', icon: FaHome },
  ];

  return (
    <div className="relative flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <div key={step.id} className="relative z-10 flex flex-col items-center">
          <step.icon className={`text-3xl ${step.id <= currentStep ? 'text-green-500' : 'text-gray-400'}`} />
          <span className={`${step.id <= currentStep ? 'text-green-500' : 'text-gray-400'} mt-2`}>
            {step.label}
          </span>
        </div>
      ))}
      {/* Line background */}
      <div className="absolute inset-0 flex items-center justify-between w-full h-1 bg-gray-200 top-1/2">
        <div
          className="h-1 bg-green-500"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
      {/* White line between icons */}
      {/* <div className="absolute inset-0 flex items-center justify-between w-full h-1 top-1/2">
        {steps.slice(1).map((_, index) => (
          <div key={index} className="w-full h-full">
            <div className="h-1 bg-white" />
          </div>
        ))} */}
      </div>
    // </div>
  );
};

export default ProgressIndicator;
