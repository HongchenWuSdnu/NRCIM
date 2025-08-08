import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import ResourceTypes from './components/ResourceTypes';
import Indicators from './components/Indicators';
import Modules from './components/Modules';
import Regions from './components/Regions';
import Observations from './components/Observations';
import './App.css';

const { Header, Sider, Content } = Layout;

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/resource-types',
      icon: <DatabaseOutlined />,
      label: '资源类型管理',
    },
    {
      key: '/indicators',
      icon: <BarChartOutlined />,
      label: '指标体系管理',
    },
    {
      key: '/modules',
      icon: <AppstoreOutlined />,
      label: '模块管理',
    },
    {
      key: '/regions',
      icon: <EnvironmentOutlined />,
      label: '区域管理',
    },
    {
      key: '/observations',
      icon: <DatabaseOutlined />,
      label: '观测数据',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <h1 style={{ margin: 0, padding: '0 24px', color: '#001529' }}>
            自然资源地理信息分类分级与多尺度安全指标体系构建系统
          </h1>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resource-types" element={<ResourceTypes />} />
            <Route path="/indicators" element={<Indicators />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/observations" element={<Observations />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 
