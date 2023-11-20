import React from 'react';
import {Link} from 'react-router-dom';
export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input type="text" className="border p-3 rounded" placeholder='username' id='username'/>
        <input type="email" className="border p-3 rounded" placeholder='email' id='email'/>
        <input type="password" className="border p-3 rounded" placeholder='password' id='password'/>
        <button className="bg-slate-700 text-white p-3 rounded uppercase hover:opacity-80">Sign Up</button>
        <button className="bg-red-700 text-white p-3 rounded uppercase hover:opacity-80">Continue with google</button>
      </form>
      <div className="flex gap-2 mt-2">
        <p>Have an account?</p>
        <Link to={'/sign-in'}><span className="text-blue-700">Sign In</span></Link>
      </div>
    </div>
  )
}
