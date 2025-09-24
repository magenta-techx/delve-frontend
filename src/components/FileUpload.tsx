import React, { useRef } from 'react';
import FileUploadIcon from '@/assets/icons/FileUploadIcon';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  label?: string;
  mutipleUploads?: boolean;
  files?: File[];
}

const FileUpload = ({
  onFileSelect,
  label,
  mutipleUploads = true,
  files = [],
}: FileUploadProps): JSX.Element => {
  // const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.files);

    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // console.log('setFiles :', setFiles(selectedFiles));

    // Avoid duplicates (based on file.name)
    const uniqueFiles = selectedFiles.filter(
      file => !files.some(f => f.name === file.name)
    );

    if (!uniqueFiles) {
      alert('File already exist');
    }
    const updatedFiles = [...files, ...uniqueFiles];

    onFileSelect(updatedFiles);

    // // reset the input so selecting the same file again will trigger onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // const handleRemoveFile = (fileName: string): void => {
  //   const updatedFiles = files.filter(file => file.name !== fileName);
  //   setFiles(updatedFiles);
  //   onFileSelect(updatedFiles);
  // };

  //   <FileUpload
  //   label="Service Images"
  //   multipleUploads={true}
  //   onFileSelect={files =>
  //     setFieldValue(`services[${index}].images`, files) // store array of files
  //   }
  // />
  return (
    <div className='flex w-full flex-col gap-1'>
      {/* File preview list */}
      {/* <button
        className='absolute left-5 top-5 rounded bg-white p-2 shadow-lg'
        onClick={() => handleRemoveFile(file.name)}
      >
       
      </button>  */}
      <label className='text-sm font-medium text-gray-400'>{label}</label>
      <div className='flex w-full flex-col items-center'>
        <div className='w-full rounded-2xl border-[1px] border-dashed border-gray-300 bg-[#FBFAFF] px-4 py-6 text-center shadow-sm'>
          {/* <Image
            src={URL.createObjectURL(file)}
            alt={`${file}`}
            width={400}
            height={200}
          /> */}
          {/* Upload icon + click trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className='flex cursor-pointer flex-col items-center justify-center space-y-2 text-gray-500 hover:text-primary'
          >
            <FileUploadIcon />
            <p className='text-sm font-medium'>Upload service image</p>
            <p className='text-[10px] text-gray-400 sm:text-xs'>
              PNG, JPG, JPEG up to 5MB
            </p>
          </div>

          {/* Hidden input */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/png, image/jpeg, image/jpg'
            multiple={mutipleUploads}
            className='hidden'
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
