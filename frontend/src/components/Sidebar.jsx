// src/components/Sidebar.jsx
import React, { useEffect, } from 'react';
import { Menu, Drawer } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  KeyOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname)
  }, [location])

  if (!collapsed) {
    return (
      <Drawer open={!collapsed} placement="left" bodyStyle={{ padding: 0 }} style={{ backgroundColor: "#111a2c" }} width="250" height="100vh" onClose={toggleSidebar}>
        <Menu mode="inline" defaultSelectedKeys={[location.pathname]} style={{ height: '85vh', borderRight: 0 }} theme="dark" onClick={toggleSidebar}>
          <Menu.Item key="/home" icon={<HomeOutlined />}>
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="/sales" icon={<AppstoreOutlined />}>
            <Link to="/sales">Sales</Link>
          </Menu.Item>
          <Menu.Item key="/statistic" icon={<CreditCardOutlined />}>
            <Link to="/statistic">Statistic</Link>
          </Menu.Item>
          <Menu.Item key="/api-keys" icon={<KeyOutlined />}>
            <Link to="/api-keys">API Keys</Link>
          </Menu.Item>
          <Menu.Item key="/settings" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Drawer>

    );
  }
};

export default Sidebar;
