// src/App.jsx
import { React, useContext, useState,} from 'react';
import { useNavigate } from "react-router-dom";
import { Layout, Avatar, Dropdown, Menu, Button } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserOutlined, SettingOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import { UserContext } from "../App";
import { isResponseOk, getCSRF } from "../utils/utils";


import "../styles/custom.css"


const { Header, Content } = Layout;

const BasePage = () => {

    const navigate = useNavigate();

    const [state, setState, isLoading, setIsLoading] = useContext(UserContext);
    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            logout()
        } else {
            navigate(`/${key}`);
        }
    };

    const logout = () => {

        console.log("logout")
        fetch("/backend/logout", {
            credentials: "same-origin",
        })
            .then(isResponseOk)
            .then((data) => {
                setState(prevState => ({ ...prevState, isAuthenticated: false, username: "None" }));
                getCSRF(setState);
            })
            .catch((err) => {
                console.error(err);
            });
    };



    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                {state["username"]}
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                Settings
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    const items = [
        {
          key: 'profile',
          label: (
              state["username"]
          ),
        },
        {
          key: 'settings',
          label: (
              'Settings'
          ),
        },
        {
          key: 'logout',
          label: (
              'Logout'
          ),
        },
      ];

    const [collapsed, setCollapsed] = useState(true);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <Layout className="site-layout">
                <Header style={{ background: '#fff', position: 'fixed', zIndex: 1, width: '100%', top: 0, display: 'flex', justifyContent: "space-between", paddingLeft: 0 }}>
                    <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={toggleSidebar}
                        style={{ fontSize: '16px', width: 64, height: 64 }} />
                    <div>
                        <img src={"/logo.svg"} style={{ width: 64, height: 64 }} />
                        <img className="fadeshow1" src={"/logo_name.svg"} style={{ height: 64 }} />
                    </div>
                    <Dropdown menu={{  onClick: handleMenuClick,items: items, }} >
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Avatar style={{ marginRight: '8px' }} icon={<UserOutlined />} />
                            <span>{state["username"]}</span>
                        </div>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '35px 16px 0', }}>
                    <div style={{ paddingTop: 24, padding: 10, minHeight: 360 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default BasePage;
