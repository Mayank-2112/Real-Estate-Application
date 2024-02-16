import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import SwipeCore from 'swiper';
import { Navigation} from 'swiper/modules';
import ListingItem from '../components/ListingItem.jsx'
export default function Home() {
  const [offer , setOffer] = useState([]);
  const [sell , setSell] = useState([]);
  const [rent , setRent] = useState([]);
  console.log(offer);
  SwipeCore.use([Navigation]);
  useEffect(()=>{
    const fetchOfferListing = async()=>{
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOffer(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListing = async()=>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRent(data);
        fetchSellListing();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSellListing = async ()=>{
      try {
        const res = await fetch('/api/listing/get?type=sell&limit=4');
        const data = await res.json();
        setSell(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListing();
  },[]);
  
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

      {/* swiper */}
      <Swiper navigation>
        {
          offer && offer.length > 0 && offer.map((listing)=>(
            <SwiperSlide>
              <div className="h-[550px]" key={listing._id} style={{background: `url(${listing.imageUrls[0]}) center no-repeat `, backgroundSize:'cover'}}></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      {/* listings */}

      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offer && offer.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offer.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rent && rent.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rent.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {sell && sell.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {sell.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
