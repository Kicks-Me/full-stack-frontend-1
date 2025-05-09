import { Button, Flex, Input, Modal, notification, Skeleton, Space, Table, Tooltip, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { tUser } from '../../types/user.type';
import { useUsers } from '../../hook/useUser';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { api } from '../../config/axios.conf';
import { useAuth } from '../../context/auth.context';
import UserFrom from './userForm';

const UserView = () => {
    const {auth} = useAuth();
    const { users, loading, error, refetch } = useUsers();
    const [filter, setFilter] = useState({
        data: [],
        isOpen: false,
        keyword: ""
    });

    const [isOpenForm, setIsOpenForm] = useState({
        show: false,
        data: null,
        editMode: false,
    });

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
            const result = await api.delete("/delete-user", {
                params: {
                    id: refData?.id
                },
                headers: {
                    Authorization: "Bearer "+ auth?.accessToken
                }
            });

            if(result && result?.data?.statusCode === 200){
                notification.success({
                    message:'success',
                    description:"Delete user successfully!"
                });

                refetch();
            }
        } 
        catch (error) 
        {
            notification.error({
                message: "Error",
                description: "Can not delete this user"
            });
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
            title: "Username",
            dataIndex: "username",

        },
        {
            title: "Role",
            render: (_: string, record:tUser, index: number) => {
                return <Typography key={index}>{record.role === "user" ? "Staff" : "Administrator"}</Typography>
            }
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

    useEffect(() => {
        if (filter.keyword !== "") {
          const delayDebounce = setTimeout(() => {
            refetch(filter.keyword);
          }, 300);

          return () => clearTimeout(delayDebounce);
        } else {
          refetch();
        }
    }, [filter]);


  return (
    <Content>
        <Flex justify='space-between' align='center'>
            <Typography.Title level={3}>User information</Typography.Title>
            <Input.Search 
                size='large' 
                placeholder='Search....' 
                className='!w-full md:!w-1/2 lg:!w-1/3 !my-5' 
                onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) =>setFilter({ ...filter, keyword: e.currentTarget.value.trim() })} 
                onSearch={(value: string) => setFilter({ ...filter, keyword: value.trim() })}
            />
        </Flex>
        <Skeleton loading={loading}>
            <Table
                columns={columns}
                dataSource={users}
                key={"id"}
            />
        </Skeleton>
        {
            !loading && error && (
                <Content className='min-h-screen flex justify-center items-center'>
                    <Typography.Title level={3} className='opacity-50'>{error}</Typography.Title>
                </Content>
            )
        }
        <UserFrom
            isOpen={isOpenForm.show}
            data={isOpenForm.data}
            editMode={isOpenForm.editMode}
            onClose={() =>
                setIsOpenForm({ show: false, data: null, editMode: false })
            }
            refresh={refetch}
        />
    </Content>
  )
}

export default UserView
