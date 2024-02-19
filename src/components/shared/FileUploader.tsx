import { FileWithPath, useDropzone } from "react-dropzone"
import { useCallback, useState } from "react"
import { Button } from "../ui/button"



type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;

}
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl)

    const onDrop = useCallback((
        acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, [file])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg']
        }
    })

    return (

        <div {...getRootProps()} className="flex flex-center flex-col rounded-xl cursor-pointer bg-dark-3 ">
            <input {...getInputProps()} className="cursor-pointer" />
            {
                fileUrl ? (
                    <>
                        <div className="flex-1 justify-center w-full p-5 lg:p-5">

                            <img src={fileUrl} alt="image"
                                className="h-80 w-full object-cover object-top rounded-[24px] lg:h-[480px] "
                            />
                        </div>
                        <p className="file_uploader-label">Click Or drag photo to replace</p>
                    </>
                ) : (
                    <div className="flex-center flex-col p-7 h-80 lg:h-[612px]">
                        <img src="/assets/icons/file-upload.svg"
                            alt="file-upload"
                            width={96}
                            height={77}
                        />

                        <h3 className="base-medium text-light-2 mb-2 mt-6">Drag Photo here</h3>
                        <p className="text-light-4 mb-6 small-regular">SVG,PNG,JPG</p>

                        <Button className="shad-button_dark_4">
                            Select from devide
                        </Button>
                    </div>
                )

            }
        </div>

    )
}

export default FileUploader