import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cartState, decreaseCartItemQty, increaseCartItemQty, removeCartItem, resetCart } from '../../redux/slice/cart';
import {Button, Col, Flex, Image, Modal, notification, Row, Typography} from 'antd';
import { generateRandomCode, getFileUrl } from '../../util/fileHelper';
import { dbService } from '../../service/axios.service';
import { Method } from 'axios';

type CartItem = {
    productId: number;
    productName: string;
    productSlug: string;
    price: number;
    qty: number;
    image: string;
};

type Props = {
    isOpen: boolean
    onClose: ()=>void;
}

const CartItem: React.FC<Props> = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const selectorCartItem = useSelector(cartState);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRemoveCart = (evt: React.MouseEvent, item_: any) => {
        evt.preventDefault();
        dispatch(removeCartItem(Number(item_.productId)));
    }

    const handleIncreaseCart = (evt: React.MouseEvent, item_: any) => {
        evt.preventDefault();
        const obj = {
            productId: item_.productId || 0,
            qty: 1
        }

        dispatch(increaseCartItemQty(obj));
    }

    const handleDecreaseCart = (evt: React.MouseEvent, item_: any) => {
        evt.preventDefault();
        const obj = {
            productId: item_.productId || 0,
            qty: 1
        }

        dispatch(decreaseCartItemQty(obj));
    }


    const handleSave = async() => {
        if(!selectorCartItem || selectorCartItem?.length === 0){
            return;
        }

        try 
        {
            setLoading(true);
            const sell_id = generateRandomCode(6);

            await Promise.all(
                selectorCartItem.map(item =>
                  dbService('/create-sell/product', 'post' as Method, {
                    sell_id,
                    product_id: item.productId,
                    qty: item.qty
                  })
                )
            );

            dispatch(resetCart());

            notification.success({
                message:'Success',
                description:"Buy product successfully!"
            });

            onClose();
        } 
        catch (error) 
        {
            notification.error({
                message:'Error....',
                description:"Can not buy now!"
            });
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(selectorCartItem.length < 1){
            onClose();
        }
    },[selectorCartItem]);

  return (
    <Modal
        open={isOpen}
        onCancel={onClose}
        maskClosable={false}
        width={550}
        title={
            <Typography.Title level={3}>ລາຍການທີ່ສັ່ງຊື້</Typography.Title>
        }
        footer={
            <Button type='primary' loading={loading} onClick={handleSave} className='w-full mt-16'>ຊໍາລະ</Button>
        }
    >
        <Row gutter={24}>
            {   selectorCartItem?.length > 0 &&
                selectorCartItem.map((item: CartItem, index: number) => (
                    <Col span={24} key={index} className={`py-2 ${index > 0 ? 'border-t border-gray-200' : ''}` }>
                        <Row gutter={10}>
                            <Col span={4}>{item?.image && <Image src={getFileUrl(item.image) || ""} width={60} height={50} className='rounded'/>}</Col>
                            <Col span={8}>
                                <Typography.Title level={5}>{item.productName}</Typography.Title>
                                <Typography.Text>{item.productSlug}</Typography.Text>
                            </Col>
                            <Col span={6}>
                            <Flex align='center' justify='space-between' gap={2} className='h-full'>
                                <Button disabled={Number(item.qty) < 2} onClick={(e)=>handleDecreaseCart(e, item)}>-</Button>
                                <Typography>{Number(item.qty || 0)}</Typography>
                                <Button onClick={(e)=>handleIncreaseCart(e, item)}>+</Button>
                            </Flex>
                            </Col>
                            <Col span={6}>
                                <Flex vertical justify='flex-end' gap={5}>
                                    <Typography className='text-end'>{Number(item.price).toFixed(2)}</Typography>
                                    <button onClick={(e)=>handleRemoveCart(e, item)} className='!text-end text-red-600 cursor-pointer hover:text-red-400'>ລົບອອກ</button>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                ))
            }
        </Row>
    </Modal>
  )
}

export default CartItem