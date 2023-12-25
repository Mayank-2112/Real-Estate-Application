import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import SwipeCore from 'swiper';
import { Navigation} from 'swiper/modules';
export default function Home() {
  const [offer , setOffer] = useState([]);
  const [sell , setSell] = useState([]);
  const [rent , setRent] = useState([]);
  SwipeCore.use([Navigation]);
  useEffect(()=>{
    const fetchOfferListing = async()=>{
      try {
        const res = await fetch('/api/listing/get?offer=true&limmit=4');
        const data = await res.json();
        setOffer(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListing = async()=>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limmit=4');
        const data = await res.json();
        setRent(data);
        fetchSellListing();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSellListing = async ()=>{
      try {
        const res = await fetch('/api/listing/get?type=sell&limmit=4');
        const data = await res.json();
        setSell(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListing();
  })
  const handleClick = ()=>{
    
  }
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 text-3xl lg:text-6xl font-bold'>Find your next
          <span className='text-slate-500'> perfect</span>
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Real Estate is the best place to find your next perfect place to live. <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-700 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>
      <button onClick={handleClick}>search</button>

      {/* swiper */}
      <Swiper>
        {
          offer && offer.length > 0 && offer.map((listing)=>{
            <SwiperSlide>
              <div className="h-[550px]" key={listing._id} style={{background: `url(${listing.imageUrls[0]}), center no-repeat `, backgroundSize:'cover'}}></div>
            </SwiperSlide>
          })
        }
      </Swiper>



      {/* listings */}
    </div>
  )
}
