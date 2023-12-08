import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row gap-4'>
        <div className='p-7 md:min-h-screen border-b-2 md:border-r-2'>
          <form className='flex flex-col gap-8'>
            <div className='flex items-center gap-4 mt-4'>
              <label className='whitespace-nowrap font-semibold'> Search Term:-</label>
              <input type="text" id='searchTerm' placeholder='Search...' className='border w-full p-3 rounded' />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className='whitespace-nowrap font-semibold'>Type:</label>
              <div className="flex gap-2">
                <input type="checkbox" id="all" className='w-5'/>
                <span>Rent & Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className='w-5'/>
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="sell" className='w-5'/>
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className='w-5'/>
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items center">
              <label className="whitespace-nowrap font-semibold">Amenities:</label>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className='w-5'/>
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className='w-5'/>
                <span>Parking</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="whitespace-nowrap font-semibold">Sort:</label>
              <select id="sort_order" className='p-3 rounded border'>
                <option>Price high to low</option>
                <option>Price low to high</option>
                <option>Latest</option>
                <option>Oldest</option>
              </select>
            </div>
            <button className='uppercase p-3 w-full rounded-lg bg-slate-700 text-white hover:opacity-80'>Search</button>
          </form>
        </div>
        <div className='p-7'>
            <h1 className='text-3xl font-semibold text-slate-700'>Listing Result:-</h1>
        </div>
    </div>
  )
}
