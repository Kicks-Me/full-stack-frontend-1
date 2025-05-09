import { Button, Flex, Input, Modal, notification, Skeleton, Space, Table, Tooltip, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { RiStickyNoteAddFill } from 'react-icons/ri';
import { Method } from "axios";
import { tUser } from '../../types/user.type';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { api } from '../../config/axios.conf';
import { useAuth } from '../../context/auth.context';
import ProductFrom from './ProductFrom';
import { dbService } from '../../service/axios.service';

const ProductView = () => {
    const {auth} = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string | "">("");
    const [isOpenForm, setIsOpenForm] = useState({
        show: false,
        data: null,
        editMode: false,
      });

    const getProducts = async() => {
        try 
        {
            setLoading(true);

            const result = await dbService(`/get-products?search=${filter}`, 'get' as Method);

            if(!result || result?.status !== 200){
                notification.info({
                    message: "Information",
                    description: "Can not get products"
                });

                return;
            }


            setProducts(result?.data?.data || []);
        } 
        catch (error: any) 
        {
            notification.error({
                message: "Error",
                description: error?.message || "Something goes wrong!"
            });
        }
        finally{
            setLoading(false);
        }
    }

    const handleAction = (data: tUser ,action: "edit" | "delete") => {
        if(action === "delete"){
            confirmDelete(data);
        }

        if(action === "edit"){
            handleEdit(data);
        }
    }

    const confirmDelete = async(data: tUser) => {
        Modal.confirm({
            title: <Typography.Title level={3}>Confirm delete</Typography.Title>,
            okText: "Delete",
            cancelText:"Cancel",
            okType:"danger",
            content: <Typography.Text>Do you want to delete this item?</Typography.Text>,
            onOk: async() => {
                await handleDelete(data);
            }
        });
    }

    const handleDelete = async(refData: tUser) => {
        try 
        {
            setLoading(true);

            const result = await api.delete(`/delete-product/${refData?.id}`, {
                headers: {
                    Authorization: "Bearer "+ auth?.accessToken
                }
            });

            if(result && result?.data?.statusCode === 200){
                notification.success({
                    message:'success',
                    description:"Delete user successfully!"
                });

               getProducts();
            }
        } 
        catch (error) 
        {
            notification.error({
                message: "Error",
                description: "Can not delete this user"
            });
        }
        finally
        {
            setLoading(false);
        }
    }

    const handleEdit = (data: any) => {
        setIsOpenForm({
          show: true,
          data: data,
          editMode: true,
        });
      };

    const columns = [
        {
            title: "#",
            width: 70,
            render: (_: string,_record: tUser,index:number) => index + 1
        },
        {
            title: "Name",
            dataIndex: "name",

        },
        {
            title: "Slug",
            dataIndex: "slug"
        },
        {
            title: "Description",
            dataIndex: "description",
            render: (text: string)=>{
                return <p className='line-clamp-2'>{text}</p>
            }
        },
        {
            title: "Buy Price",
            dataIndex: "buyPrice"
        },
        {
            title: "Sell Price",
            dataIndex: "sellPrice"
        },
        {
            title: "Qty",
            dataIndex: "qty"
        },
        {
            title: "expired_at",
            dataIndex: "expired_at"
        },
        {
            title:"Created At",
            render: (_: string, record:tUser, index: number) => {
                return <Typography key={index}>{record.created_at}</Typography>
            }
        },
        {
            title: "Action",
            key: "action",
            render: (_: string, record: tUser, index: number) => {
                return <Space key={index}>
                    <Tooltip title="Click to edit">
                        <>
                            <Button onClick={()=>handleAction(record, 'edit')} icon={<FaEdit />}>Edit</Button>
                        </>
                    </Tooltip>
                    <Tooltip title="Click to delete">
                        <>
                            <Button onClick={()=>handleAction(record, 'delete')} icon={<MdDeleteForever />} danger>Delete</Button>
                        </>
                    </Tooltip>
                </Space>
            }
        }
    ];
    

    useEffect(()=>{
        getProducts();
    }, [filter]);

  return (
    <Content>
        <Typography.Title level={3}>Product information</Typography.Title>
        <Flex justify='space-between' align='center'>
            <Input.Search 
                size='large' 
                placeholder='Search....' 
                className='!w-full md:!w-1/2 lg:!w-1/3 !my-5' 
                onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) =>setFilter(e.currentTarget.value.trim())} 
                onSearch={(value: string) => setFilter( value.trim())}
            />

            <Button icon={<RiStickyNoteAddFill/>} onClick={()=>setIsOpenForm({show: true, data: null, editMode: false})} type='primary'>New</Button>
        </Flex>
        <Skeleton loading={loading}>
            <Table
                columns={columns}
                dataSource={products}
                rowKey={"id"}
                pagination={{
                    pageSize: 15
                }}
            />
        </Skeleton>
        <ProductFrom
            isOpen={isOpenForm.show}
            data={isOpenForm.data}
            isEdit={isOpenForm.editMode}
            onClose={() =>
                setIsOpenForm({ show: false, data: null, editMode: false })
            }
            refetch={getProducts}
        />
    </Content>
  )
}

export default ProductView
