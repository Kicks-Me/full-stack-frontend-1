import {RouteObject} from 'react-router-dom';
import AuthView from '../view/auth/auth.login';
import { Button, Result } from 'antd';
import ProtectLayout from '../layout/layout';
import { ProtectedRoutes } from './protect.route';
import UserView from '../view/user';
import ProductView from '../view/product';
import Shopping from '../view/shopping';
import SaleList from '../view/report/saleList';

export const route: RouteObject[] = [
    {
        path: "/login",
        element: <ProtectedRoutes><AuthView/></ProtectedRoutes>
    },
    {
        path: "/",
        element: <ProtectedRoutes><ProtectLayout /></ProtectedRoutes>,
        children: [
            {
                path: '/user',
                element: <UserView/>
            },
            {
                path: '/product',
                element: <ProductView/>
            },
            {
                path: '/shopping',
                element: <Shopping />
            },
            {
                path: '/',
                element: <Shopping />
            },
            {
                path: '/sale-report',
                element: <SaleList />
            },
        ]
    },
    {
        path: '*',
        element: <Result
                status="404"
                title="Page Not Found!"
                subTitle="Sorry, this page is missing in the web browser."
                extra={<Button type="primary" className='cursor-pointer' onClick={()=>window.location.href="/"}>Back Home</Button>}
            />
    }
]