// src/pages/Statistic.jsx
import React, { useState, useEffect, useContext } from 'react';

import { StatContext, SalesContext } from "../App";

import { Card, Row, Col } from 'antd';
import {LineChartCard, BarChartCard} from '../components/ChartCard';

import TableCard from '../components/TableCard';

const columns = [
  {
    title: 'No.',
    dataIndex: 'index',
    key: 'index',
    render: (a, b, index) => (
      index + 1
    ),
  },
  {
    title: 'Product ID',
    dataIndex: 'product_id',
    key: 'product_id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Total Quantity',
    dataIndex: 'total_quantity',
    key: 'total_quantity',
  },
];

const columns2 = [
  {
    title: 'No.',
    dataIndex: 'index',
    key: 'index',
    render: (a, b, index) => (
      index + 1
    ),
  },
  {
    title: 'Product ID',
    dataIndex: 'product_id',
    key: 'product_id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Total Revenue',
    dataIndex: 'total_revenue',
    key: 'total_revenue',
  },
];

const Statistic = () => {

  const [statData, setStatData] = useContext(StatContext);
  const [homeinfo, setHomeInfo] = useContext(SalesContext);
  
  return (
    <div>
      <h1>Statistic</h1>
      <p>Manage your Statistic methods here...</p>
      <Row gutter={[10, 10]}>
        <Col span={12} key='1' xs={24} md={24} xl={12}>
          <LineChartCard data={statData['stat_by_month']} />
      </Col>
      <Col span={12} key='2' xs={24} md={24} xl={12}>
          <BarChartCard data={statData['stat_by_year']} />
      </Col>
      <Col span={12} xs={24} md={24} xl={12}>
          <TableCard columns={columns} data={homeinfo.top_5_qty} title={"Top 5 Best Selling this year"} />
        </Col>

        <Col span={12} xs={24} md={24} xl={12}>
          <TableCard columns={columns2} data={homeinfo.top_5_revenue} title={"Top 5 Revenue Product this year"} />
        </Col>
    </Row>
      
    </div >
  );
};

export default Statistic;
