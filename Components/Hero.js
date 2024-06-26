// src/ImageSlider.js
import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel';
import slide1 from './images/slide1.webp';
import slide2 from './images/slide2.webp';
import slide3 from './images/slide3.webp';
import Image from 'next/image';

const Hero = () => {
  return (
    <Carousel
      className="rounded-xl"
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      showIndicators
      interval={3000}
    >
      <div>
        <Image
          src={slide1}
          alt="image 1"
          className="object-cover w-full h-[200px] sm:h-[380px]"
        />
      </div>
      <div>
        <Image
          src={slide2}
          alt="image 2"
          className="object-cover w-full h-[200px] sm:h-[380px]"
        />
      </div>
      <div>
        <Image
          src={slide3}
          alt="image 3"
          className="object-cover w-full h-[200px] sm:h-[380px]"
        />
      </div>
    </Carousel>
  );
}

export default Hero;
