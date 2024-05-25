import { useEffect, useState } from "react"
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast';
import { IconFolder } from '@tabler/icons-react'
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

interface tokenType {
  _id:string;
  email:string;
  firstName:string;
  lastName:string;
  iat:number
}

interface FolderProps {
  userData :tokenType 
}

interface FolderList  {
        folderName: string;
        _id: string;
    }


const backend = process.env.BACKEND;

export default  function Folder({userData}:FolderProps) {
    const [folders,setFolders] = useState<FolderList[]>([]);
    const [folderName, setFolderName] = useState('');
    const [newFolderName,setNewFolderName] = useState(folderName);
    const createFolder=async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
    //   toast.loading("Creating Folder...");
      try{
        const res = await fetch(`${backend}/api/doc/${userData?.email}/addFolder/`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body : JSON.stringify({
              folderName:folderName
            })
          });
          const data = await res.json();
          if(res.ok){
            // toast.dismiss();
            setTimeout(()=>{
                toast.success(data.msg);
                window.location.reload()
            },100)
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
                toast.error("Folder Not Created - Server Down");
            },100)
      }
    }

    const renameFolder=async(event:React.FormEvent<HTMLFormElement>,folderN:string)=>{
        event.preventDefault();
    //   toast.loading("Creating Folder...");
      try{
        const res = await fetch(`${backend}/api/doc/renameFolder/${userData?.email}`,{
            method:'PATCH',
            headers:{'Content-Type':'application/json'},
            body : JSON.stringify({
              oldFolderName:folderN,
              newFolderName:newFolderName
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
                toast.error("Folder Not Renamed - Server Down");
            },100)
      }
    }

    const deleteFolder=async(email:string,id:string,folderName:string)=>{
        try{
            const res = await fetch(`${backend}/api/doc/deleteFolder`,{
                method:"DELETE",
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email:email,
                    id:id,
                    folderName:folderName
                })
            });
            if(res.ok){
                toast.dismiss();
                setTimeout(()=>{
                    toast.success('Deleted Successfully');
                    window.location.reload();
                },100)
            }else{
                toast.dismiss();
                setTimeout(()=>{
                    toast.error(`Error in deleting`); 
                    },50)
                }
        }catch{
            toast.dismiss();
                setTimeout(()=>{
                    toast.error(`Error in deleting`); 
                    },50)
        }
    }

    useEffect(()=>{
        console.log(userData);
        const getFolders =async () => {
            if(userData?.email){
                const res = await fetch(`${backend}/${userData.email}/getFolders`);
                const data = await res.json();
                setFolders(data.folderList);
            }
        }
        getFolders();
    },[userData])
    // console.log(folders);
  return (
  <div className=" w-[90vw] md:w-[80vw] xl:w-[50vw] py-4 px-2 border rounded-lg shadow sm:p-8 bg-zinc-900 border-gray-700 h-max mt-10 mx-auto ">
    <div className="flex items-center justify-between mb-4 mx-auto w-full ">
        <h5 className="text-2xl font-bold leading-none text-white">Your Folders</h5>
        {/* <button className="bg-purple-700 px-6 text-sm gap-3 py-2 text-white rounded-full flex items-center">
            
        </button> */}
        <Dialog>
            <DialogTrigger className="bg-purple-700 px-6 text-sm gap-3 py-2 text-white rounded-full flex items-center">
                <IconFolder size={20} />
            <p>
                Add Folder
            </p>
            </DialogTrigger>
            <DialogContent className="dark">
                <DialogHeader className=" space-y-4">
                {/* <DialogTitle>Add New Folder</DialogTitle> */}
                <DialogDescription className="">
                <form onSubmit={(e)=>{createFolder(e)}} className='w-full h-max space-y-4'>
                    <div className="">
                        <label htmlFor="folder" className="block mb-2 text-lg font-medium dark:text-white text-gray-900 ">Folder Name</label>
                        <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " onChange={(e) => {setFolderName(e.target.value)}} required/>
                    </div>
                    <button type="submit" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Create Folder</button>
                </form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
   </div>
   <div className="">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {
            folders
            ?
            folders.map((folder:FolderList )=>(
                <li key={folder._id} className="flex items-center space-x-4 justify-between w-full ">
                    <Link className="hover:bg-gray-700 flex w-full space-x-4 bg-none py-2 sm:py-4 px-2 rounded-lg" href={`/folder/${userData?.email}/${folder?.folderName}`}>
                            <span className="w-8 h-8 rounded-full px-4 bg-gradient-to-r from-purple-600 via-violet-800 to-blue-500 "></span>
                            <p className="text-lg w-full font-medium text-white">
                                {folder?.folderName}
                            </p>
                    </Link>
                    <Dialog>
                        <DialogTrigger className="bg-purple-700 hover:bg-purple-800 text-white transition-all rounded-full text-xs px-2 py-1 ">
                            Delete
                        </DialogTrigger>
                        <DialogContent className="dark">
                            <DialogHeader>
                            <DialogTitle className="text-white">Are you sure absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your Folder
                                and remove your data from our servers.
                                <div className=" w-full flex gap-4 h-max">
                                    <button 
                                    onClick={()=>{deleteFolder((userData?.email) as string,folder._id,folder.folderName )}} 
                                    className="px-4 py-2 bg-red-500 active:bg-red-700 rounded-lg text-sm text-white mt-2">
                                        Delete
                                    </button>
                                    <DialogClose className="px-4 py-2 bg-blue-100 active:bg-blue-200 rounded-lg text-sm mt-2">
                                        Cancel
                                    </DialogClose>
                                </div>
                            </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger className="bg-purple-700 hover:bg-purple-800 text-white transition-all rounded-full text-xs px-2 py-1 ">
                            Rename
                        </DialogTrigger>
                        <DialogContent className="dark">
                             <form onSubmit={(e)=>{renameFolder(e,folder?.folderName)}} className='w-full h-max space-y-4'>
                                        <div className="">
                                            <label htmlFor="folder" className="block mb-2 text-lg font-medium dark:text-white text-gray-900 ">
                                                Rename Folder
                                            </label>
                                            <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " onChange={(e) => {setNewFolderName(e.target.value)}} required/>
                                        </div>
                                        <button type="submit" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "> Rename</button>
                                    </form>
                        </DialogContent>
                    </Dialog>
                </li>
            ))
            :
            <li className="flex items-center space-x-4 justify-between w-full ">
                You have not created any folders yet
            </li>
        }
        </ul>
   </div>
   <Toaster/>
</div>
  )
}
