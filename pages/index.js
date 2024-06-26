'use client'
import Hero from '@/Components/Hero'
import Track from '@/Components/Track'
import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/Firebase/config';
import Product from './Product';
import ChatIcon from '@/Components/ChatIcon';

import Category from './../Components/Category';
import Loader from '@/Components/Loader';
import ProductCard from '@/Components/productsCard';
import Trending from '@/Components/Trending';
import Todaydeal from '@/Components/Todaydeal';
import Flashsale from '@/Components/Flashsale';
import Card from '@/Components/card';


const Home = () => {

  // const router = useRouter();

  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (!user) {
  //       router.push('/');
  //     }
  //   });
  // }, [router]);
  return (
   <>
   
   <Hero/>
   <Category/>
   <ProductCard/>
    <Product/>
    <Trending/>
    <Card/>
    <Todaydeal/>
    <Flashsale/>
    <Track/>
    <ChatIcon/>
    <Loader/>
   </>
    
      
   
  )
}

export default Home