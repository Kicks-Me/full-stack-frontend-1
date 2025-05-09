
import { Button, Modal, Typography, Form, Input, Row, Col, InputNumber, DatePicker, notification } from 'antd'
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import uploadImage from '../../components/uploadImage';
import { LuText } from 'react-icons/lu';
import dayjs from 'dayjs';
import { dbService } from '../../service/axios.service';
import { Method } from 'axios';


interface Props {
    isOpen: boolean;
    onClose: ()=>void;
    data?: any;
    isEdit?: boolean;
    refetch?: ()=>void;
}

const ProductFrom: React.FC<Props> = ({...props}) => {
    const [form] = Form.useForm();
    const {loadingImage, imageName, setImageName, UploadNow} = uploadImage();
    const [loading, setLoading] = useState<boolean>(false);

    const handleClose  = () =>{
        form.resetFields();
        setImageName(null);
        props.onClose();
    }

    const onFinish = async(values: any) => {
        try 
        {
            setLoading(true);

            const body = {
                name: values?.name, 
                description: values?.description,
                slug: values?.slug,
                expired_at: values?.expired_at ? dayjs(values.expired_at).format("YYYY-MM-DD") : "",
                qty: values?.qty,
                sellPrice: values?.sellPrice,
                buyPrice: values?.buyPrice,
                image: imageName ?? ""
            }

            if(props?.isEdit){
                // edit data 
                if(!props?.data?.id){
                    notification.warning({
                        message: "Warning...",
                        description: "Ref Id is not available."
                    });

                    return;
                }

                const result = await dbService(`/update/product/${props?.data?.id}`, 'put' as Method, body);

                if(!result || result?.status !== 200){
                    notification.error({
                        message: "Error...",
                        description: "Can not create products"
                    });

                    return;
                }
            }
            else
            {
                const result = await dbService(`/create/product`, 'post' as Method, body);

                if(!result || result?.status !== 201){
                    notification.error({
                        message: "Error...",
                        description: "Can not create products"
                    });

                    return;
                }
            }

            notification.info({
                message: "Information",
                description: "Operation successfully!"
            });

            props.refetch?.();
            setImageName(null);
            form.resetFields();
        } 
        catch (error) 
        {
            
        }
        finally
        {
            setLoading(false);
        }
    }


    useEffect(()=>{
        if(props?.data && props?.isEdit){
            form.setFieldsValue({
                name: props?.data?.name, 
                description: props?.data?.description,
                slug: props?.data?.slug,
                expired_at: props?.data?.expired_at ? dayjs(props?.data.expired_at) : "",
                qty: props?.data?.qty,
                buyPrice: props?.data?.buyPrice,
                sellPrice: props?.data?.sellPrice
            });

            setImageName(props?.data?.image)
        }
    },[props.data, form]);

  return (
    <Modal
        open={props.isOpen}
        title={<Typography.Title level={4} className={`pb-2 border-b flex flex-nowrap items-center whitespace-nowrap`}><LuText className='mr-2'/> Product management </Typography.Title>}
        maskClosable={false}
        onCancel={handleClose}
        style={{ top: 10 }}
        width={650}
        footer={[
            <Content key={'custom-footer'} className='flex flex-1 justify-center items-center gap-10 border-t pt-5'>
                <Button loading={loadingImage || loading} htmlType='submit' form='form' type='primary' className='py-5 px-10'>Save</Button>
                <Button type='default' onClick={handleClose} danger className='py-5 px-10'>Cancel</Button>
            </Content>
        ]}
    >
        <Form
            form={form}
            name='form'
            layout='vertical'
            onFinish={onFinish}
        >
            <Form.Item name={'name'} label="Product name" rules={[{required: true, message:"Please, enter product name."}]}>
                <Input placeholder='Enter product name' autoComplete='name'/>
            </Form.Item>
            <Row gutter={[24,24]}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name={'expired_at'} label="Expire date" rules={[{required: true, message:"Please, select product expire date."}]}>
                        <DatePicker placeholder='YYYY-MM-DD' format={"YYYY-MM-DD"} autoComplete='expired_at' className='w-full'/>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name={'qty'} label="Quantity" rules={[{required: true, message:"Please, enter product quantity."}]}>
                        <InputNumber placeholder='0' autoComplete='qty' className='!w-full'/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[24,24]}>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name={'buyPrice'} label="Buy Price" rules={[{required: true, message:"Please, enter buy price."}]}>
                       <InputNumber autoComplete='buyPrice' placeholder='0' className='!w-full'/>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item name={'sellPrice'} label="Sell Price" rules={[{required: true, message:"Please, enter sell price."}]}>
                        <InputNumber autoComplete='sellPrice' placeholder='0' className='!w-full'/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item name={'slug'} label="Product slug" rules={[{required: true, message:"Please, enter product slug."}]}>
                <Input.TextArea placeholder='Enter product slug' autoComplete='slug' rows={2}/>
            </Form.Item>
            <Form.Item name={'description'} label="Description">
                <Input.TextArea placeholder='Enter product description' autoComplete='description' rows={3}/>
            </Form.Item>
            <Form.Item label="Select image" style={{ margin: 0 }}>
                {UploadNow()}
            </Form.Item>
        </Form>
    </Modal>
  )
}

export default ProductFrom