import type { GetProp, UploadProps } from 'antd';
export type MyFileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];