import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sideBarData, setsideBarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc'
  });
  const [listings,setListings] = useState([]);
  const [showMore,setShowMore] = useState(false);
  const [loading,setLoading] = useState(false);
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    if(
    searchTermFromUrl ||
    typeFromUrl ||
    parkingFromUrl ||
    furnishedFromUrl ||
    offerFromUrl ||
    sortFromUrl ||
    orderFromUrl
    ){
      setsideBarData({
        searchTerm: searchTermFromUrl || '', 
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
        });
    }
    const fetchListings = async ()=>{
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      console.log(data.length);
      if(data.length > 8){
        setShowMore(true);
      }
      else{
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  },[location.search]);

  const handleChange = (e)=>{
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sell'){
      setsideBarData({...sideBarData, type: e.target.id})
    }
    if(e.target.id === 'searchTerm'){
      setsideBarData({...sideBarData, searchTerm: e.target.value})
    }
    if(e.target.id === 'parking' || e.target.id === 'furnsihed' || e.target.id === 'offer'){
      setsideBarData({...sideBarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
    }
    if(e.target.id === 'sort_order'){
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setsideBarData({...sideBarData, sort, order});
    }
  };
  
  const handleSubmit = (e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', sideBarData.searchTerm)
    urlParams.set('type', sideBarData.type)
    urlParams.set('parking', sideBarData.parking)
    urlParams.set('furnished', sideBarData. furnished)
    urlParams.set('offer', sideBarData.offer)
    urlParams.set('sort', sideBarData.sort)
    urlParams.set('order', sideBarData.order)
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  const onShowMoreClick = async ()=>{
    const no_of_listings = listings.length;
    const startIndex = no_of_listings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startindex',startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);

    const data = await res.json();
    console.log(data);

    if (data.length < 9){
      setShowMore(false);
    }
    setListings([...listings,...data]);
  }
  return (
    <div className='flex flex-col md:flex-row gap-4 bg-slate-50'>
        <div className='sticky p-3 md:min-h-screen border-b-2 md:border-r-2'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className='flex items-center gap-4 mt-4'>
              <label className='whitespace-nowrap font-semibold'> Search Term:-</label>
              <input type="text" id='searchTerm' placeholder='Search...' className='border w-full p-3 rounded' 
              value={sideBarData.searchTerm} onChange={handleChange}/>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className='whitespace-nowrap font-semibold'>Type:</label>
              <div className="flex gap-2">
                <input type="checkbox" id="all" className='w-5'
                checked={sideBarData.type === 'all'}
                onChange={handleChange}/>
                <span>Rent & Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className='w-5'
                checked={sideBarData.type === 'rent'}
                onChange={handleChange}/>
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="sell" className='w-5'
                checked={sideBarData.type === 'sell'}
                onChange={handleChange}/>
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className='w-5'
                checked={sideBarData.offer}
                onChange={handleChange}/>
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items center">
              <label className="whitespace-nowrap font-semibold">Amenities:</label>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className='w-5'
                checked={sideBarData.furnished}
                onChange={handleChange}/>
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className='w-5'
                checked={sideBarData.parking}
                onChange={handleChange}/>
                <span>Parking</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <label className="whitespace-nowrap font-semibold">Sort:</label>
              <select id="sort_order" className='p-3 rounded border' onChange={handleChange} defaultValue={'created_at_desc'}>
                <option value={'regularPrice_desc'}>Price high to low</option>
                <option value={'regularPrice_asc'}>Price low to high</option>
                <option value={'createdAt_desc'}>Latest</option>
                <option value={'createdAt_asc'}>Oldest</option>
              </select>
            </div>
            <button className='uppercase p-3 w-full rounded-lg bg-slate-700 text-white hover:opacity-80'>Search</button>
          </form>
        </div>
        <div className='py-5 px-1 flex-1'>
            <h1 className='text-3xl font-semibold border-b text-slate-700'>Listing Result:-</h1>
            <div className='p-7 flex flex-wrap gap-4'>
              {!loading && listings.length === 0 && (
                <p className="text-xl text-slate-700">No listings found!!</p>
              )}
              {loading && (
                <p className="text-2xl text-center w-full text-slate-700">Loading..</p>
              )}
              {!loading && listings && listings.map((listing)=>(
                <ListingItem key={listing._id} listing={listing}/>
              ))}

              {showMore && (
                <button onClick={onShowMoreClick} className='p-7 text-green-700 hover:underline'>
                  Show More
                </button>
              )}
            </div>

        </div>
    </div>
  )
}
