import {useState ,useRef, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import { updateUserStart, updateUserFailure, updateUserSuccess } from '../redux/user/userSlice.js';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state)=> state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  
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
        <button className="bg-green-700 text-white p-3 rounded uppercase hover:opacity-80">Create Listings</button>
      </form>
      <div className="flex justify-between mt-2">
        <Link to={'/sign-up'}><span className="text-red-700">Delete Account</span></Link>
        <Link to={'/sign-up'}><span className="text-red-700">LogOut</span></Link>
      </div>
      <div className="text-center mt-2">
        <Link to={'/sign-up'}><span className="text-green-700">Show Listings</span></Link>
      </div>
      <p className="text-red-700">{error ? error: ''}</p>
      <p className="text-green-700">{updateSuccess ? "User updated successfully": ""}</p>
    </div>
  )
}
