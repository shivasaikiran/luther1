import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} absolute top-1/2 right-2 transform -translate-y-1/2`}
            style={{ ...style, zIndex: 10 }}
            onClick={onClick}
        >
            <FaChevronRight className="h-8 w-8 text-green-500 relative bottom-[45px]" />
        </div>
    );
};

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} absolute top-1/2 left-2 transform -translate-y-1/2`}
            style={{ ...style, zIndex: 10 }}
            onClick={onClick}
        >
            <FaChevronLeft className="h-8 w-8 text-green-500 relative bottom-[45px] right-2" />
        </div>
    );
};

export { NextArrow, PrevArrow };
