import {useState ,useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess } from '../redux/user/userSlice.js';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state)=> state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userListings, setUserListings] = useState([]);
  
  useEffect(()=>{
    if (file){
      handleFileUpload(file);
    }
  },[file]);
  
  const handleFileUpload = (file)=>{
      const storage = getStorage(app);
      const fileName = new Date().getTime()+ file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);

      uploadTask.on
        ('state_changed',
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setFilePerc(Math.round(progress));
        },
        (error)=>{
          setFileUploadError(true);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then(
            (downloadURL)=>{
              setFormData({...formData, avatar:downloadURL});
            }
          )
        }
      );
  }
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]: e.target.value})
  };
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false){
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: "DELETE",
      })
      const data = await res.json();
      if (data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async ()=>{
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data === false){
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }
  const handleShowListings = async ()=>{
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }
  const handleDeleteListing = async (id)=>{
    try {
      const res = await fetch(`/api/listing/delete/${id}`,{
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings((prev)=> 
      prev.filter((listing)=> listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img src={formData.avatar || currentUser.avatar} onClick={()=> fileRef.current.click()}alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-5" />
        <p className='text-center'>
          {fileUploadError ?
            (<span className="text-red-700">Error Uploading Image(Image must be less than 2MB)</span>):
            filePerc > 0 && filePerc < 100 ?(
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ):
            filePerc === 100 ? (
              <span className="text-green-700">Image Uploaded Successfully</span>
            ): ""
          }
        </p>
        <input type="text" className="border p-3 rounded" onChange={handleChange} defaultValue={currentUser.username} placeholder='username' id='username' />
        <input type="email" className="border p-3 rounded" onChange={handleChange} defaultValue={currentUser.email} placeholder='email' id='email' />
        <input type="password" className="border p-3 rounded" onChange={handleChange} placeholder='password' id='password' />
        <button disabled={loading} type='submit' className="bg-slate-700 text-white p-3 rounded uppercase hover:opacity-80">
        {loading ? 'Loading...' : 'Update'}</button>
        <Link className="bg-green-700 text-center text-white p-3 rounded uppercase hover:opacity-80" to={"/create-listing"}>Create Listings</Link>
      </form>
      <div className="flex justify-between mt-2">
        <Link to={'/sign-in'}><span onClick={handleDeleteUser} className="text-red-700">Delete Account</span></Link>
        <Link to={'/sign-up'}><span onClick={handleSignOut} className="text-red-700">LogOut</span></Link>
      </div>
      <div className="text-center mt-2">
        <button onClick={handleShowListings} className="text-green-700">Show Listings</button>
      </div>
      

      <p className="text-red-700">{error ? error: ''}</p>
      <p className="text-red-700">{showListingsError ? "error showing listings": ''}</p>
      <p className="text-green-700">{updateSuccess ? "User updated successfully": ""}</p>

      {userListings && userListings.length > 0 && userListings.map((listing)=>
        <div key={listing._id} className='border p-3 rounded flex justify-between items-center mt-5'>
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing image" className='h-16 w-16 object-contain' />
          </Link>
          <Link to={`/listing/${listing._id}`}>
            <p className='flex-1  font-semibold text-slate-700 hover:underline truncate'>{listing.name}</p>
          </Link>
          <div className="flex flex-col">
            <button onClick={()=>handleDeleteListing(listing._id)} className='text-red-700'>Delete</button>
            <button className='text-green-700'>Edit</button>
          </div>
        </div>
      )}

    </div>
  )
}
