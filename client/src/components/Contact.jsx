import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
export default function Contact ({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const params = useParams();
    const onChange = (e)=>{
        setMessage(e.target.value);
    }
    useEffect(()=>{
        const fetchLandlord = async ()=>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false){
                    return;
                }
                setLandlord(data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    },[listing.userRef]);
  return (
    <>
    {landlord && (
        <div className='flex flex-col'>
            <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
            <textarea name="message" id="message" rows="2" value={message} onChange={onChange}
            placeholder='Enter your message here...' className='w-full rounded border border-gray-300 mt-2 p-3'
            ></textarea>
            <Link to={`mailto:${landlord.email}?subject-regarding ${listing.name}&body=${message}`} className='text-white bg-slate-700 text-center p-3 rounded mt-2 hover:opacity-80 uppercase'>
                Send Message
            </Link>
        </div>
    )}
    </>
  )
}
