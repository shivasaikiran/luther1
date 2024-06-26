import { useContext, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSpring, animated } from 'react-spring';
import { useInterval } from 'react-use';
import myContext from '@/Context/myContext'; // Adjust path as per your project structure

const category = [
    {
        image: 'https://cdn-icons-png.flaticon.com/256/4359/4359963.png',
        name: 'Herbal Juices'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/11833/11833323.png',
        name: 'Herabal Capsules'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/8174/8174424.png',
        name: ' Herbal Vinegar'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/7648/7648246.png',
        name: 'Herbal Drops'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12142/12142416.png',
        name: 'Herbal Salts'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12142/12142416.png',
        name: 'Herbal Soaps'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12142/12142416.png',
        name: 'Herbal Prash'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/4359/4359963.png',
        name: 'Herbal Juices'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/11833/11833323.png',
        name: 'Herabal Capsules'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/8174/8174424.png',
        name: ' Herbal Vinegar'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/7648/7648246.png',
        name: 'Herbal Drops'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12142/12142416.png',
        name: 'Herbal Salts'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12142/12142416.png',
        name: 'Herbal Soaps'
    },
    {
        image: 'https://cdn-icons-png.flaticon.com/256/12142/12142416.png',
        name: 'Herbal Prash'
    },
    
  
    
];

const Category = () => {
    const router = useRouter();
    const { setCategory } = useContext(myContext);
    const [isDragging, setIsDragging] = useState(false);
    const [startIndex, setStartIndex] = useState(0);
    const categoryListRef = useRef(null);

    // Spring for smooth animation
    const springProps = useSpring({
        to: { scrollLeft: isDragging ? categoryListRef.current.scrollLeft : 0 },
        config: { tension: 120, friction: 20 }
    });

    // Auto-scroll functionality
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useInterval(() => {
        if (!autoScrollEnabled) return;
        const nextIndex = (currentIndex + 1) % category.length;
        setCurrentIndex(nextIndex);
        scrollToIndex(nextIndex);
    }, 2000); // Set interval to 2 seconds

    const scrollToIndex = (index) => {
        if (categoryListRef.current) {
            const itemWidth = categoryListRef.current.scrollWidth / category.length;
            const scrollLeft = index * itemWidth;
            categoryListRef.current.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleCategoryClick = (categoryName) => {
        setCategory(categoryName);
        router.push(`/CategoryPage/${categoryName}`);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const moveX = e.movementX * 2;
        categoryListRef.current.scrollLeft -= moveX;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const listRef = categoryListRef.current;
        const handleScroll = () => {
            if (listRef.scrollLeft + listRef.clientWidth >= listRef.scrollWidth) {
                setCurrentIndex(0);
                listRef.scrollTo({ left: 0, behavior: 'smooth' });
            }
        };

        listRef.addEventListener('scroll', handleScroll);

        return () => {
            listRef.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="flex flex-col mt-5 overflow-hidden">
        <animated.div
            ref={categoryListRef}
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseUp={() => handleMouseUp()}
            style={{
                ...springProps,
                display: 'flex',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
            }}
            className="flex"
        >
            {category.map((item, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center px-3 lg:px-6"
                >
                    <Link href={`/CategoryPage/${item.name}`}>
                        <div className="w-16 pt-1 mb-1 transition-all bg-green-500 rounded-full cursor-pointer lg:w-18 aspect-w-1 aspect-h-1 lg:h-18 hover:bg-green-400">
                            <div className="flex items-center justify-center">
                                <img src={item.image} alt="img" className="rounded-full" />
                            </div>
                        </div>
                    </Link>
                    <h1 className='mt-1 overflow-hidden text-sm font-bold text-center lg:text-right lg:text-sm lg:mt-0 whitespace-nowrap overflow-ellipsis'>
                        {item.name}
                    </h1>
                </div>
            ))}
        </animated.div>
    </div>
    
    );
};

export default Category;
