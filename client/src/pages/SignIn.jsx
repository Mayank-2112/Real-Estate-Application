import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loadling, error} = useSelector((state)=> state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e)=>{
      e.preventDefault();
      dispatch(signInStart());
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
          dispatch(signInFailure(data.message));
          return;
        }
        dispatch(signInSuccess(data));
        navigate('/');
      } catch (error) {
        dispatch(signInFailure(error.message));
      }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" className="border p-3 rounded" placeholder='email' id='email' onChange={handleChange}/>
        <input type="password" className="border p-3 rounded" placeholder='password' id='password' onChange={handleChange}/>
        <button disabled={loadling} className="bg-slate-700 text-white p-3 rounded uppercase hover:opacity-80">
          {loadling ? 'Loading...' : 'Sign In'}</button>
        <button className="bg-red-700 text-white p-3 rounded uppercase hover:opacity-80">Continue with google</button>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}><span className="text-blue-700">Sign Up</span></Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}
