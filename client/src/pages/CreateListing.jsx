import {useState}from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [upLoading, setUpLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
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
  return (
    <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create a
    Listing</h1>
    <form className='flex flex-col sm:flex-row gap-6'>
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
          <button type='submit' className='p-3 rounded bg-slate-700 text-white hover:opacity-80'>Create Listing</button>
      </div>
    </form>
    </main>
  )
}
