'use client'
import  { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconCloudUpload } from '@tabler/icons-react'
import toast, { Toaster } from 'react-hot-toast';
import convertToBase64 from '@/lib/convertToBase64';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import decodeURIComponent  from 'decode-uri-component'; 
import Tesseract from 'tesseract.js';

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
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string >('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {'image/*':[]}, multiple: false });

  const handleUpload = async () => {
    if (!image) return;

      setUploading(true);

      try {
        const { data: { text } } = await Tesseract.recognize(image, 'eng');
        setText(text);

        const base64 = await convertToBase64(image) as string;
        const response = await fetch(`http://localhost:3001/${decodeURIComponent(email)}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: base64,
            folderName: folderName,
            imageName: image.name,
            text: text
          }),
        });

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
        setUploading(false);
    }
};






  return (
    <div className="flex flex-col items-center justify-center">
      <div {...getRootProps({ className: 'dropzone cursor-pointer bg-red-500 h-64 w-96 rounded-lg' })}>
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full mb-4 rounded-lg" />
        ) : (
          <p className="text-gray-500">Drag & drop image here, or click to select</p>
        )}
      </div>
      <button
        onClick={handleUpload}
        disabled={!image || uploading}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {text && (
        <div className="mt-4 text-white">
          <h3 className="text-xl font-semibold">Text:</h3>
          <p className="mt-2 ">{text}</p>
        </div>
      )}
    </div>
  );
};

export default DropZone;
