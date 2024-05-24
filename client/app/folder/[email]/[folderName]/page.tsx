"use client"
import React, { useEffect,useState } from 'react'
import { Navbar } from '@/components/Navbar';
import {IconBookUpload} from '@tabler/icons-react'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import DeleteButton from '@/components/DeleteButton';
import toast from 'react-hot-toast';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import DropZone from '@/components/DropZone';
import ImageSkel from '@/components/ImageSkel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { Toaster } from 'react-hot-toast';
import decodeURIComponent  from 'decode-uri-component'; 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';

interface ImageInfo {
    _id: string;
    email: string;
    folderName: string;
    imageName: string;
    imageCaption:string;
    imageCloud: {
        _id:string;
        versionName: string;
        generatedName: string;
    };
    __v: number;
}

const backend = process.env.BACKEND;
const cloudName = process.env.CLOUD_NAME;


 const FolderPage=({params}:{params: {email:string;folderName:string;}}) =>{
  const [images,setImages] = useState<ImageInfo[]>([]);
  const [loading,setLoading] = useState(true);
  const [newImageName,setNewImageName] = useState('')
  const decodedFolderName = decodeURIComponent(params.folderName);
  const [searchValue,setSearchValue] = useState<string>('');

  const renameImage=async(event:React.FormEvent<HTMLFormElement>,id:string)=>{
        event.preventDefault();
    //   toast.loading("Creating Folder...");
      try{
        const res = await fetch(`${backend}/renameImage`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body : JSON.stringify({
              email: decodeURIComponent(params.email),
              id:id,
              folderName:params?.folderName,
              newImageName:newImageName
            })
          });
          const data = await res.json();
          if(res.ok){
            // toast.dismiss();
            setTimeout(()=>{
                toast.success(data.msg);
            },100)
            setTimeout(()=>{
                window.location.reload()
            },1000)
          }
          else{
            // toast.dismiss();
            setTimeout(()=>{
                toast.error(data.msg);
            },100)
          }
      }catch{
        // toast.dismiss();
            setTimeout(()=>{
                toast.error("Image Not Renamed - Server Down");
            },100)
      }
    }

  useEffect(()=>{
    const getFolderData = async ()=>{
        const res = await fetch(`${backend}/getFolderData/${params.email}/${params.folderName}`,{cache:'no-store'});
        const data = await res.json();
        setImages(data);
        setLoading(false);
      }
    getFolderData();
  },[loading,params.email,params.folderName])

    
  

  // const images:ImageInfo[] = await getFolderData(params.email,params.folderName);

  return (

    <main className='text-white pb-10'>
      <Navbar/>
      <section className='w-[80vw] mx-auto mt-6'>
        <div className='flex w-full justify-between'>
          <h1 className='text-4xl'>{decodedFolderName}</h1>
          <Drawer>
            <DrawerTrigger className='bg-purple-700 px-6 text-sm gap-3 rounded-full flex items-center'>New <IconBookUpload size={20} stroke={1}/> </DrawerTrigger>
            <DrawerContent className='dark'>
              <DropZone folderName={decodedFolderName as string} email={params.email as string}  />
            </DrawerContent>
          </Drawer>
          <input type="search" id="default-search" onChange={(e)=>{setSearchValue(e.target.value)}} className="block w-full lg:w-[500px] px-4 py-2.5 ps-10 text-sm text-black border  rounded bg-gray-50 placeholder:text-gray-200 focus:outline-none " placeholder="Search" required />
        </div>
        {/*  */}
        {
          loading
          ?
          <ImageSkel/>
          :
          <div className={`w-max grid ${images.length >0 ? 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1 ':'grid-cols-1'} gap-8 mx-auto mt-6 place-content-center`}>
          {
            images.length >0
            ?
              images.filter((item)=>{
                return searchValue.toLowerCase() ===''? item: item.imageCaption.toLowerCase().includes(searchValue.toLowerCase()) || item.imageName.toLowerCase().includes(searchValue.toLowerCase())
              }).map((data:ImageInfo)=>(
              <Card key={data._id} className='dark w-72'>
              <CardContent>
                <img className='w-full h-56 rounded-xl mt-6' width={100} height={100} src={`https://res.cloudinary.com/${cloudName}/image/upload/v${data.imageCloud.versionName}/${data.imageCloud.generatedName}`} alt={data.imageName} />
              </CardContent>
              <CardFooter>
                <div className='w-full'>
                  <h1 className='text-center'>{data.imageName}</h1>
                <div className='w-full gap-4 flex'>
                  <Dialog>
                  <DialogTrigger className=' text-white hover:underline text-sm'>Rename</DialogTrigger>
                  <DialogContent className='dark'>
                    <form onSubmit={(e)=>{renameImage(e,data?._id)}} className='w-full h-max space-y-4'>
                      <div className="">
                        <label htmlFor="image" className="block mb-2 text-lg font-medium dark:text-white text-gray-900 ">
                          Rename Image
                        </label>
                        <input type="text" id="image" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " onChange={(e) => {setNewImageName(e.target.value)}} required/>
                      </div>
                      <button type="submit" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "> Rename</button>
                    </form>
                  </DialogContent>
                </Dialog>
                {/*  */}
                <Dialog>
                  <DialogTrigger className=' text-red-500 hover:underline text-sm'>Delete</DialogTrigger>
                  <DialogContent className='dark'>
                    <DialogHeader>
                      <DialogTitle className='text-white'>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your image
                        and remove your data from our servers.
                      </DialogDescription>
                      <DialogFooter className='flex w-full'>
                        <DialogClose className='bg-blue-100 px-3 py-2 rounded text-sm'>
                          Cancel
                        </DialogClose>
                        <DeleteButton id={data._id}/>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                </div>
                </div>
                
              </CardFooter>
            </Card>

            ))
            :
            <div className='w-full h-max flex justify-center items-center mx-auto'>
              No Images available yet
            </div>
          }
        </div>
        }
        
      </section>
      <Toaster/>
    </main>
  )
}

export default FolderPage;