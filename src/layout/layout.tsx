import { useState } from 'react';
import {Layout, Flex, Button, Space, Menu, MenuProps, Typography, Badge, Avatar, FloatButton} from 'antd';
const {Content, Sider, Header, Footer} = Layout;
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { AiFillProduct, AiOutlineShopping } from 'react-icons/ai';
import { FaUserFriends } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { IoHome } from 'react-icons/io5';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { MdLogout, MdOutlineShoppingCart } from 'react-icons/md';
import { useAuth } from '../context/auth.context';
import { BsMinecartLoaded } from 'react-icons/bs';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { cartState } from '../redux/slice/cart';
import CartItem from '../view/shopping/cartItem';

type MenuItem = Required<MenuProps>['items'][number];

const ProtectLayout= () => {
    const selectorCartItem = useSelector(cartState);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {auth, logout} = useAuth();
    const [openCart, setOpenCart] = useState<boolean>(false);

    const menuItems: MenuItem[] = [
        {
            key: "/",
            icon: <IoHome size={20} color="gray" />,
            label:"Home"
        },
        {
            key: "/user",
            icon: <FaUserFriends size={20} color="#dbdbdb" />,
            label:"User"
        },
        {
            key: "/product",
            icon: <AiFillProduct size={20} color="#dbdbdb" />,
            label:"Product"
        },
        {
            key: "/shopping",
            icon: <AiOutlineShopping size={20} color="#dbdbdb" />,
            label:"Shopping"
        },
        {
            key: "/report",
            icon: <HiOutlineDocumentReport size={20} color="#dbdbdb" />,
            label:"Reports",
            children: [
                {
                    key: "/sale-report",
                    icon: "",
                    label:"Sale report"
                },
            ]
        },
        {
            key: "/setting",
            icon: <IoMdSettings size={20} color="#dbdbdb" />,
            label:"Setting",
            children: [
                {
                    key:"/setting/user",
                    icon:"",
                    label:"User"
                },
                {
                    key:"/setting/product",
                    icon:"",
                    label:"Prodcut"
                },
            ]
        },
    ];

    const handleClick: MenuProps['onClick'] = (e) => {
        if(!e.key) navigate('/');

        navigate(e.key);
    }

  return (
    <Layout className='!min-h-screen'>
        <Sider trigger={null} collapsible collapsed={collapsed} className='!pt-12 !p-5'>
            <Menu theme='dark' items={menuItems} mode='inline' defaultSelectedKeys={[location.pathname]} onClick={handleClick}/>
        </Sider>
        <Layout className='!bg-gray-200'>
            <Header className='!p-0'>
                <Flex justify='space-between' align='center' >
                    <Space>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64, color:"white"}}
                        />
                        <Typography className='!text-white !text-2xl'><span className='text-gray-400'>Welcome: </span>{`${auth?.username}`}</Typography>
                    </Space>
                    <Space className='!text-gray-50 !mr-7'>
                        <Flex>
                            { 
                                selectorCartItem.length > 0 &&
                                <Badge size="small" onClick={()=> selectorCartItem.length > 0 ? setOpenCart(true) : null} count={selectorCartItem.length} overflowCount={99} color='#1677ff' className={`!p-0 !mr-16 !my-auto ${selectorCartItem.length > 0 ? '!mt-5' : ''}`}>
                                    <Avatar src={<BsMinecartLoaded color='white' size={20}/>} size={"large"} className='!p-0 cursor-pointer !opacity-90'/>
                                </Badge>
                            }
                            <Button
                                type="text"
                                icon={<MdLogout />}
                                onClick={logout}
                                style={{ fontSize: '16px', width: 64, height: 64, color:"white"}}
                            >
                                Logout
                            </Button>
                        </Flex>
                    </Space>
                </Flex>
            </Header>
            <Layout className='!bg-gray-200 !p-5'>
                <Content className='!bg-gray-50 !p-5 !rounded'>
                    <Outlet/>
                </Content>
                {
                    selectorCartItem.length > 0 &&
                    <FloatButton icon={<MdOutlineShoppingCart/>} onClick={() => selectorCartItem.length > 0 ? setOpenCart(true) : null} type='primary' badge={{ dot: true}} className='!bg-emerald-600'/>
                }
            </Layout>
            <Footer className='!bg-gray-200 !pt-1 !pb-3 text-center !text-gray-500'>
                @CopyRight 2025
            </Footer>
        </Layout>

        <CartItem isOpen={openCart} onClose={()=>setOpenCart(false)}/>
    </Layout>
  )
}

export default ProtectLayout
