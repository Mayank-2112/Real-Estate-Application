import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loadling, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e)=>{
      e.preventDefault();
      setLoading(true);
      try {
        const res = await fetch('/api/auth/signin',
        {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false){
          setError(data.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        setError(null);
        navigate('/');
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" className="border p-3 rounded" placeholder='username' id='username' onChange={handleChange}/>
        <input type="email" className="border p-3 rounded" placeholder='email' id='email' onChange={handleChange}/>
        <input type="password" className="border p-3 rounded" placeholder='password' id='password' onChange={handleChange}/>
        <button disabled={loadling} className="bg-slate-700 text-white p-3 rounded uppercase hover:opacity-80">
          {loadling ? 'Loading...' : 'Update'}</button>
        <button className="bg-green-700 text-white p-3 rounded uppercase hover:opacity-80">Create Listings</button>
      </form>
      <div className="flex justify-between mt-2">
        <Link to={'/sign-up'}><span className="text-red-700">Delete Account</span></Link>
        <Link to={'/sign-up'}><span className="text-red-700">LogOut</span></Link>
      </div>
      <div className="text-center mt-2">
        <Link to={'/sign-up'}><span className="text-green-700">Show Listings</span></Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}
