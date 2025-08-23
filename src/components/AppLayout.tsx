import React, { useState, useEffect } from 'react';
import {  Outlet } from 'react-router-dom';

import { Layout } from 'antd';

const { Header, Content } = Layout;


const AppLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: "white", fontSize: 24 }}>Fishbone Creator</div>
      </Header>
      <Content style={{margin: 24}}>
          <Outlet />
        </Content>
    </Layout>
  );
};

export default AppLayout;