'use client'
import  { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconCloudUpload } from '@tabler/icons-react'
import toast, { Toaster } from 'react-hot-toast';
import convertToBase64 from '@/lib/convertToBase64';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const backend = process.env.BACKEND;

interface DropZoneProps{
    folderName:string;
    email:string;
}

interface Image{
  name: string;
  base64: string ;
}

const DropZone = ({folderName,email}:DropZoneProps) => {
    const router = useRouter();
  const [images, setImages] = useState<Image[]>([]); // Store objects with name and Base64

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Process the dropped images here, convert each image to Base64, and add them to the state.
    for (const file of acceptedFiles) {
      try {
        const base64: string = await convertToBase64(file) as string; // Explicitly type 'base64' as string
        setImages((prevImages) => [...prevImages, { name: file.name,  base64 }]);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*' :[] } ,
    onDrop,
    multiple: true,
  });

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const imageUpload=async()=>{
    toast.loading("Uploading...");
    if(images.length===0){
        toast.dismiss();
        toast.error("No Images detected");
        return;
    }
        try{
            images.forEach(async(img)=>{
                const res = await fetch(`${backend}/${email}/upload`,{
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                      folderName: folderName,
                      imageName: img.name ,
                      image:img.base64,
                    })
                  }
                  )
                  const data = await res.json();
                  if(res.ok){
                    toast.dismiss();
                    setTimeout(()=>{
                      toast.success(data.msg);
                    },100)
                  }
                  else{
                    toast.dismiss();
                    setTimeout(()=>{
                      toast.error(data.msg);
                    },100)
                    
                  }
                
            })
          
        }catch(err){
          toast.dismiss();
          setTimeout(()=>{
            toast.error("Error Posting Image");
          },100)
        }
        finally{
            setImages([]);
            setTimeout(()=>{
              window.location.reload();
            },5000)
        }

  }

  return (
    <section className='h-3/5 pb-40 w-screen overflow-x-hidden overflow-y-auto pt-24 flex flex-col items-center' >
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='flex flex-col justify-center items-center h-80 w-[85vw] xl:w-[70vw] rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer transition-all duration-300 border-dashed border-2 border-blue-950' >
            <IconCloudUpload/>
            <p className='text-base'>Drag and drop images here</p>
        </div>
      </div>
        <div className=' mt-2 space-x-2'>
        <button className=' bg-purple-600 w-24 h-10 rounded-full text-white' onClick={()=>{imageUpload()}}>
          Upload
        </button>
        <button className=' bg-purple-600 w-24 h-10 rounded-full text-white' onClick={()=>{setImages([])}}>
          Clear All
        </button>
        </div>
        
        <div className='grid grid-cols-2 gap-y-12 md:grid-cols-3  lg:grid-cols-5 w-[85vw] xl:w-[70vw] justify-items-center mt-4'>
            {images.map((image, index) => (
                <article key={index} className="w-40 h-40 lg:w-48 lg:h-48 relative">
                <Image
                  width={150}
                  height={150}
                  className="w-40 h-40 lg:w-48 lg:h-48 rounded-t-lg"
                  src={image.base64}
                  alt={`Image ${index}`}
                />
                <button
                  className="absolute top-2 right-0 px-3 py-1 hover:opacity-100 opacity-50 text-white bg-slate-800 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  X
                </button>
                <caption className=' bg-slate-600 rounded-b-lg w-full h-4 text-white py-4 grid place-content-center text-sm text-ellipsis overflow-hidden'>
                    {image.name}
                </caption>
              </article>
                
                ))}
        </div>
    {/* <Toaster/> */}
    </section>
  );
};

export default DropZone;
