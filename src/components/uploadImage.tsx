import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Image, notification, Upload } from 'antd';
import { api } from "../config/axios.conf";
import { getFileUrl } from "../util/fileHelper";
import { TOKEN_KEY } from "../constant/constant";
import { IoClose } from "react-icons/io5";

const uploadImage = () => {
    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState<string | null>(null);

    const handleUpload = async({ file, onSuccess, onError }: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem(TOKEN_KEY);
        
            const response = await api.post('/upload/file', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer "+ token
              },
            });

            if(response && response?.data?.resultCode !== 200){
                notification.error({
                    message: "Error.....",
                    description:"Can not upload image"
                });
            }
            
            setImageName(response.data.fileName || null);
            onSuccess?.(response.data, file);

        } catch (error) {
            notification.error({
                message: "Error.....",
                description:"Can not upload image"
            });

            setImageName(null);
            onError?.(error);
        }
        finally{
            setLoading(false);
        }
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>ອັບໂຫຼດຮູບ</div>
        </button>
      );

    const UploadNow = () => {
        return (
            <>
                {
                    !imageName && (
                    <Upload
                        listType="picture-card"
                        customRequest={handleUpload}
                        accept="image/png, image/jpeg, image/jpg"
                    >
                        {uploadButton}
                    </Upload>
                    )
                }
                {imageName && (
                    <div className="relative w-[120px] h-[80px] max-w-[120px]">
                        <div className="w-full h-full border border-gray-200 rounded overflow-hidden">
                            <Image src={getFileUrl(imageName) || ""} alt="uploaded" preview={true} className="w-full h-full object-cover"/>
                        </div>
                    {
                        imageName && (
                            <IoClose color="red" size={22} className="absolute -right-6 top-0 -translate-1/2 bg-white p-0 rounded-full border border-gray-200 shadow-md cursor-pointer" onClick={()=>setImageName(null)}/>
                        )
                    }
                  </div>
                )}
            </>
        )
    }

  return {loadingImage: loading, UploadNow, imageName, setImageName}
  
}

export default uploadImage