import { Button, Drawer, Form, Input, notification, Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth.context';
import { api } from '../../config/axios.conf';

interface Props {
    isOpen: boolean;
    data: any;
    editMode: boolean;
    onClose: () => void;
    refresh: () => void;
};

const UserFrom: React.FC<Props> = ({isOpen, data, onClose, ...props}) => {
    const [form] = Form.useForm();
    const {auth}  = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async(values: any) => {

        if(!values.username || !values.password || !values.confirm_password || !values.role || !props?.editMode || !data?.id){
            notification.warning({
              message:"Warning...",
              description: "Please, input fields"
            });
      
            return;
          }
      
          if(values.confirm_password !== values.password){
            notification.warning({
              message:"Retry",
              description:"Password is not matched"
            });
      
            return;
        }

        try 
        {
            setLoading(true);

            const body = {
                username: values.username,
                password: values.password,
                role: values.role
              };

            const result = await api.put(`/update/user/${data?.id}`, body, {
                headers: {
                    Authorization: "Bearer "+ auth?.accessToken
                }
            });

            if(result && result?.data?.statusCode === 200){

                notification.success({
                    message: "ສຳເລັດ",
                    description:"ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ!"
                });

                props.refresh();
                form.resetFields();
            }
        } 
        catch (error) 
        {
            console.log(error);
            notification.error({
                message:"ຜິດພາດ...",
                description:"ການບັນທຶກລົ້ມແຫຼວ!"
            })
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(data && data?.id){
            form.setFieldsValue({
                username: data?.username,
                role: data?.role
            });
        }
    },[data]);

  return (
    <Drawer
      title="ຈັດການມື້ພັກວຽກລັດຖະການ"
      width={600}
      onClose={onClose}
      open={isOpen}
      placement='right'
      extra={
        <Space>
            <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#054656", border: 0, width: "100%" }}
                form="form"
                loading={loading}
            >
                ບັນທຶກ
            </Button>
        </Space>
      }
    >
        <Form
            form={form}
            id="form"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
        >
          <Form.Item label="Username" name={"username"} rules={[{required: true}]}>
            <Input size="large" autoComplete="username" placeholder="Enter username" />
          </Form.Item>
          <Form.Item label="Password" name={"password"} rules={[{required: true}]}>
            <Input.Password size="large"  placeholder="Enter password" />
          </Form.Item>
          <Form.Item label="Confirm password" name={"confirm_password"} rules={[{required: true}]}>
            <Input.Password size="large" autoComplete="confirm_password" placeholder="Enter password" />
          </Form.Item>
          <Form.Item label="Select role" name={"role"} rules={[{required: true}]}>
            <Radio.Group size="large" block options={[{value: 'user', label:"User"},{value:'admin', label:'Admin'}]} optionType="button" buttonStyle="solid"/>
          </Form.Item>
        </Form>
    </Drawer>
  )
}

export default UserFrom