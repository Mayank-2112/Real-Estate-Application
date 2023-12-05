import {useState}from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function CreateListing() {
  const {currentUser, loading} = useSelector((state)=> state.user)
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [upLoading, setUpLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  console.log(formData);
  const handleImageUpload = (e)=>{
    if (files.length > 0 && files.length + formData.imageUrls.length < 7){
      setUpLoading(true);
      setImageUploadError(false);
      const promises = [];
      for(let i=0; i<files.length; i++){
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls)=>{
        setFormData({...formData,
          imageUrls: formData.imageUrls.concat(urls)
        });
        setImageUploadError(false);
        setUpLoading(false);
      }).catch((err)=>{
        setImageUploadError('Image upload failed (2MB per image)');
      })
    }
    else{
      setImageUploadError('You can only upload 6 images per listing');
    }
  };
  const storeImage = async (file)=>{
    return new Promise((resolve,reject)=>{
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);

      uploadTask.on(
        "state_changed",
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          console.log(`Upload is ${progress}% done`);
        },
        (error)=>{
          reject(error);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downlodURL)=>{
            resolve(downlodURL);
          });
        }
      )
    })
  }
  const handleRemoveImage= (indx)=>{
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_,i)=> i!= indx),
    })
  }
  const handleChange = (e)=>{
    if (e.target.id === 'sell' || e.target.id === 'rent' ){
      setFormData({
        ...formData,
        type : e.target.id,
      })
    }
    if (e.target.id === 'parking' ||e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      })
    }
    if (e.target.type === 'number' ||e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      })
    }
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1 ) return setError('You have to upload atleast 1 image');
      if (formData.discountPrice > formData.regularPrice ) return setError('Discount price should be less than regular price');
      setError(false);
      const res = await fetch('api/listing/create',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }) 
      });
      const data = await res.json();
      if(data.success === true){
        setError(data.message)
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create a
    Listing</h1>
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
      <div className="flex flex-col gap-4 flex-1">
        <input type="text" placeholder='Name' className='border p-3
        rounded-lg' id='name' value={formData.name} onChange={handleChange} maxLength='62' minLength='10' required />
        <textarea type="text" placeholder='Description' className='border
        p-3 rounded-lg' id='description' value={formData.description} onChange={handleChange} required />
        <input type="text" placeholder='Address' className='border p-3
        rounded-lg' id='address' value={formData.address} onChange={handleChange} required />
        <div className='flex flex-wrap gap-6'>
          <div className="flex gap-2">
            <input type="checkbox" id="sell" className='w-5'
            onChange={handleChange}
            checked={formData.type === 'sell'}/>
            <span>Sell</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="rent" className='w-5'
            onChange={handleChange}
            checked={formData.type === 'rent'}/>
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="furnished" className='w-5'
            onChange={handleChange}
            checked={formData.furnished}/>
            <span>Furnished</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="parking" className='w-5'
            onChange={handleChange}
            checked={formData.parking}/>
            <span>Parking Spot</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="offer" className='w-5'
            onChange={handleChange}
            checked={formData.offer}/>
            <span>Offer</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="flex gap-2 items-center">
            <input type="number" id="baths" className='p-3 rounded border border-gray-300' min='1' max='10' required 
            onChange={handleChange} value={formData.bedrooms}/>
            <span>Bathrooms</span>
          </div>
          <div className="flex gap-2 items-center">
            <input type="number" id="beds" className='p-3 rounded border border-gray-300' min='1' max='10' required 
            onChange={handleChange} value={formData.bathrooms}/>
            <span>Bedrooms</span>
          </div>
          <div className="flex gap-2 items-center text-center">
            <input type="number" id="regularPrice" className='p-3 rounded border border-gray-300' min='50' max='1000000' required 
            onChange={handleChange} value={formData.regularPrice}/>
            <p>Regular Price</p>
            {formData.type === 'rent' && (
              <span className='text-xs'>($/month)</span>
            )}
          </div>
          {formData.offer && (
          <div className="flex gap-2 items-center text-center">
            <input type="number" id="discountPrice" className='p-3 rounded border border-gray-300' min='50' max='1000000' required 
            onChange={handleChange} value={formData.discountPrice}/>
            <p>Discounted price</p>
            {formData.type === 'rent' && (
              <span className='text-xs'>($/month)</span>
            )}
          </div>
          )}
        </div>
      </div>
      <div className='flex flex-col flex-1 gap-6'>
        <p className="font-semibold">Images:
          <span className="text-gray-600 ml-2">The first image will be the cover (max 6)</span>
        </p>
        <div className='flex gap-4'>
          <input onChange={(e)=> setFiles(e.target.files)} className='p-3 rounded w-full border border-gray-300' type="file" accept='image/*' id="images" multiple/>
          <button disabled={upLoading} onClick={handleImageUpload} className="p-3 border border-green-600 text-green-700 hover:shadow disabled:opacity-80 rounded uppercase">
            {upLoading ? 'Uploading...': 'Upload'}
            </button>
        </div>
          <p className="text-red-700">{imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url,i)=>(
              <div className="flex justify-between p-3 border" key={i}>
                <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded' />
                <button onClick={()=>handleRemoveImage(i)} className='text-red-700 rounded uppercase p-3 hover:opacity-60'>Delete</button>
              </div>
            ))
          }
          <button  disabled={loading || upLoading} type='submit' className='p-3 rounded bg-slate-700 text-white hover:opacity-80'>
            {loading ? 'Creating...' : 'Create Listing'}</button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
      </div>
    </form>
    </main>
  )
}
