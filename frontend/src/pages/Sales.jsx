// src/pages/Sales.jsx
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, DatePicker, Space } from 'antd';
import TableCard from "../components/TableCard";
import dayjs from 'dayjs';

import { SalesContext } from "../App";

import "../styles/custom.css"




const Sales = () => {

  const [homeinfo, setHomeInfo] = useContext(SalesContext);



  function onDateChange(data) {
    console.log(data)
      homeinfo['selected_date'] = data["$d"];
      console.log(homeinfo);
      setHomeInfo(homeinfo);
  }

  const title_element = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h3 style={{ margin: 0 }}>Products Sold</h3>
      <DatePicker defaultValue={dayjs()} onChange={onDateChange} />
    </div>
  )

  return (
    <div>
      <h1>Sales</h1>
      <Row gutter={[10, 10]}>
        <Col span={6} key='1' xs={12} md={8} xl={6}>
          <Card className="card_shadow" title={homeinfo.total_sales_ytd.title} bordered={true}>
            <h1 className="display-1">{homeinfo.total_sales_ytd.content}</h1>
          </Card>
        </Col>
        <Col span={6} key='2' xs={12} md={8} xl={6}>
          <Card title={homeinfo.total_sales_mtd.title} bordered={true}>
            <h1 className="display-1">{homeinfo.total_sales_mtd.content}</h1>
          </Card>
        </Col>
        <Col span={6} key='3' xs={12} md={8} xl={6}>
          <Card title={homeinfo.total_sales_today.title} bordered={true}>
            <h1 className="display-1">{homeinfo.total_sales_today.content}</h1>
          </Card>
        </Col>
        <Col span={6} key='4' xs={12} md={8} xl={6}>
          <Card title={homeinfo.number_of_products.title} bordered={true}>
            <h1 className="display-1">{homeinfo.number_of_products.content}</h1>
          </Card>
        </Col>

        <Col span={12} key='5' xs={24} md={12} xl={12}>
          <TableCard title={title_element} bordered={true}>
          </TableCard>
        </Col>
      </Row>
    </div>
  )

};

export default Sales;
