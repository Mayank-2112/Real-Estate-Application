import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'
import { useEffect, useState } from 'react'

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const {currentUser} = useSelector(state => state.user);
  const navigate = useNavigate();
  const handleSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  useEffect (() => {
    const urlParams = new URLSearchParams (location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
    setSearchTerm(searchTermFromUrl);
    }
    }, [location.search]);
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
          <Link to='/'>
            <h1 className="font-bold flex flex-wrap text-sm sm:text-xl">
                <span className="text-slate-500">Real</span>
                <span className="text-slate-700">Estate</span>
            </h1>
          </Link>
            <form onSubmit={handleSubmit} className='flex items-center rounded bg-slate-100 px-4 py-3 '>
                <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
                <FaSearch className='text-slate-600'/>
                
            </form>
            <ul className='flex gap-[20px]'>
              <li className='hidden sm:inline text-slate-700 hover:underline'><Link to="/">Home</Link></li>
              <li className='hidden sm:inline text-slate-700 hover:underline'><Link to="/about">About</Link></li>
              
                {currentUser ?(<Link to='/profile'>
                  <img className="rounded-full h-7 w-7 object-cover"src={currentUser.avatar} alt="Profile" /></Link>
                ):<Link to="/sign-in">
                <li className='text-slate-700 hover:underline'>SignIn</li></Link>
              }
              
            </ul>
        </div>
    </header>
  )
}
