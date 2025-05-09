import React, { useState } from 'react'
import {Avatar, Button, Card, Image, Modal, Typography} from "antd";
import { getFileUrl } from '../util/fileHelper';
import Meta from 'antd/es/card/Meta';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addCartItem, removeCartItem } from '../redux/slice/cart';
import { Content } from 'antd/es/layout/layout';

type Props = {
    item: any;
}

const ProductCard: React.FC<Props> = ({item}) => {
    const dispatch = useDispatch();
    const [preview, setPreview] = useState<boolean>(false);

    const handleAddCart = (evt: React.MouseEvent, item_: any) => {
        evt.stopPropagation();
        const obj = {
            productId: item_.id || 0,
            productName: item_.name || "",
            productSlug: item_.slug || "",
            price: item_.sellPrice || 0,
            qty: 1,
            image: item_.image || ""
        }

        dispatch(addCartItem(obj));
    }

    const handleRemoveCart = (evt: React.MouseEvent, item_: any) => {
        evt.stopPropagation();
        dispatch(removeCartItem(item_.id));
    }


  return (
    <React.Fragment>
        <Card
            hoverable
            style={{ width: "100%"}}
            cover={<img alt="image" src={getFileUrl(item?.image) || ""} className='h-[130px]'/> }
            actions={[
            <Button icon={<FaPlus />} type='link' onClick={(e)=>handleAddCart(e, item)}>Add cart</Button>,
            <Button icon={<FaMinus />} type='link' onClick={(e)=>handleRemoveCart(e, item)}>Remove cart</Button>
            ]}
            onClick={()=>setPreview(true)}
        >
            <Meta
                style={{height: 150, maxHeight: 150, overflow:'hidden'}}
                avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                title={<Typography.Title level={3} className='line-clamp-1 !m-0 !p-0'>{item?.name ?? ""}</Typography.Title>}
                description={<Content>
                    <Typography.Text className='line-clamp-3 !m-0 !p-0'>{item?.slug ?? item?.description ?? "...."}</Typography.Text>
                    <Typography.Title level={4}>{`${item.sellPrice} ₭`}</Typography.Title>
                </Content>}
            />
        </Card>
        <Modal
            open={preview}
            title={item?.name ?? "Preview Product"}
            onOk={()=>setPreview(false)}
            okText="Close"
            onCancel={()=>setPreview(false)}
            okType='primary'
            footer={
                <Button type="primary" onClick={()=>setPreview(false)}>
                  Close
                </Button>
              }
        >
            <Meta
                style={{height: 150, maxHeight: 150, overflow:'hidden'}}
                avatar={<Image src={getFileUrl(item?.image) || ""} alt="Image" height={50} width={50} className='rounded-full shadow-lg border border-gray-200'/>}
                title={<Typography.Title level={4}>{`${item.sellPrice} ₭`}</Typography.Title>}
                description={<Typography.Text>{item?.slug ?? item?.description ?? "...."}</Typography.Text>}
            />
        </Modal>
    </React.Fragment>
  )
}

export default ProductCard