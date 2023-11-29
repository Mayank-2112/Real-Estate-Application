import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create a
    Listing</h1>
    <form className='flex flex-col sm:flex-row'>
      <div className="flex flex-col gap-4 flex-1">
        <input type="text" placeholder='Name' className='border p-3
        rounded-lg' id='name' maxLength='62' minLength='10' required />
        <textarea type="text" placeholder='Description' className='border
        p-3 rounded-lg' id='description' required />
        <input type="text" placeholder='Address' className='border p-3
        rounded-lg' id='address' required />
        <div className='flex flex-wrap gap-6'>
          <div className="flex gap-2">
            <input type="checkbox" id="sell" className='w-5'/>
            <span>Sell</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="rent" className='w-5'/>
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="furnished" className='w-5'/>
            <span>Furnished</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="parking" className='w-5'/>
            <span>Parking Spot</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="offer" className='w-5'/>
            <span>Offer</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="flex gap-2 items-center">
            <input type="number" id="baths" className='p-3 rounded border border-gray-300' min='1' max='10' required />
            <span>Bathrooms</span>
          </div>
          <div className="flex gap-2 items-center">
            <input type="number" id="beds" className='p-3 rounded border border-gray-300' min='1' max='10' required />
            <span>Bedrooms</span>
          </div>
          <div className="flex gap-2 items-center text-center">
            <input type="number" id="regularPrice" className='p-3 rounded border border-gray-300' min='1' max='20' required />
            <span>Regular Price <br />($/ Month)</span>
          </div>
          <div className="flex gap-2 items-center text-center">
            <input type="number" id="discountPrice" className='p-3 rounded border border-gray-300' min='1' max='20' required />
            <span>Discount Price <br />($/Month)</span>
          </div>
        </div>
      </div>
    </form>
    </main>
  )
}
