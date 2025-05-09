import { Button, Card, Flex, Form, Input, Modal, notification, Radio } from "antd";
import { api } from "../../config/axios.conf";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../../context/auth.context';


interface IAuth {
  username: string;
  password: string;
}

const AuthView = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [registerForm] = Form.useForm();
    const [register, setRegister] = useState(false);
    const { login } = useAuth();

  const onFinish = async (values: IAuth) => {
    if(!values?.username || !values.password){
        notification.warning({
            message: "warning",
            description:"Enter username or password"
        });

        return
    }

    try 
    {
        const result = await api.post("/login", {
            username: values.username,
            password: values.password
        });


        if (!result || result?.data?.statusCode !== 200) {
          notification.error({
            message: 'ເກີດຂໍ້ຜິດພາດ',
            description: result?.data?.message || 'ບໍ່ສາມາດເຂົ້າສູ່ລະບົບໄດ້',
          });
          return;
        }

        const auth = {
          accessToken: result?.data?.accessToken,
          username: result?.data?.username
        };

        login(auth);

        notification.success({
            message:"success",
            description:"Login success"
        });

        navigate('/');
    } 
    catch (error) 
    {
        notification.error({
            message:"Error",
            description: "Can not login"
        });
    }
  };

  const handleSubmit = ()=>{
    registerForm.submit();
  }

  const onRegister = async(values: any)=>{

    if(!values.username || !values.password || !values.confirm_password || !values.role){
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
      const body = {
        username: values.username,
        password: values.password,
        role: values.role
      };

      const result = await api.post('/register/user', body);

      if(!result || result?.data?.statusCode !== 201){
        notification.error({
          message: "Failed",
          description: result?.data?.message || "Can not register"
        });

        return;
      }

      notification.success({
        message:"Success",
        description: result.data.message || "Register success"
      });

      registerForm.resetFields();
      handleClose();
    } 
    catch (error) 
    {
      notification.error({
        message:"Error",
        description:"Can not register this user!"
      });
    }
  }

  const handleClose = ()=> {
    setRegister(false);
  }

  return (
    <Flex 
      justify="center" 
      align="center" 
      style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
      }}
    >
      <Card
        title={<h1 style={{ textAlign: 'center', margin: 0 }}>ເຂົ້າສູ່ລະບົບ</h1>}
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: 8,
        }}
        headStyle={{
          background: '#1890ff',
          color: 'white',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          style={{ padding: '0 10px' }}
        >
          <Form.Item
            name="username"
            label="ຊື່ຜູ້ໃຊ້"
            rules={[{ required: true, message: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້!' }]}
          >
            <Input
              size="large"
              placeholder="ຊື່ຜູ້ໃຊ້"
              prefix={<i className="fas fa-user" style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="ລະຫັດຜ່ານ"
            rules={[{ required: true, message: 'ກະລຸນາປ້ອນລະຫັດຜ່ານ!' }]}
          >
            <Input.Password
              size="large"
              placeholder="ລະຫັດຜ່ານ"
              prefix={<i className="fas fa-lock" style={{ marginRight: 8 }} />}
            />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: '48%' }}
              >
                ເຂົ້າສູ່ລະບົບ
              </Button>
              <Button
                type="link"
                size="large"
                style={{ width: '48%' }}
                onClick={()=>setRegister(true)}
              >
                ລົງທະບຽນ
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        open={register}
        title="Register Form"
        width={500}
        onOk={handleSubmit}
        onCancel={handleClose}
        okText="Submit"
        cancelText="Back"
        onClose={handleClose}
        maskClosable={false}
      >
        <Form
          form={registerForm}
          name="register"
          onFinish={onRegister}
          layout="vertical"
          style={{ padding: '0 10px' }}
        >
          <Form.Item label="Username" name={"username"} rules={[{required: true}]}>
            <Input size="large" autoComplete="username" placeholder="Enter username" />
          </Form.Item>
          <Form.Item label="Password" name={"password"} rules={[{required: true}]}>
            <Input.Password size="large" autoComplete="password" placeholder="Enter password" />
          </Form.Item>
          <Form.Item label="Confirm password" name={"confirm_password"} rules={[{required: true}]}>
            <Input.Password size="large" autoComplete="confirm_password" placeholder="Enter password" />
          </Form.Item>
          <Form.Item label="Select role" name={"role"} rules={[{required: true}]}>
            <Radio.Group size="large" block options={[{value: 'user', label:"User"},{value:'admin', label:'Admin'}]} optionType="button" buttonStyle="solid"/>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default AuthView;
