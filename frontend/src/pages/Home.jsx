import { React, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

import { Card, Row, Col } from 'antd';

import MapCard from "../components/MapCard";




export default function Home() {

  const [state, setState, isLoading, setIsLoading] = useContext(UserContext);
  return (
    <div>
      <h1>Spark IoT</h1>
      <p>Home</p>
      <Row gutter={[10, 10]}>
      <Col span={6} key='1' xs={12} md={8} xl={6}>
      <Card title={'Profile'} bordered={true}>
      <p className="display-1">User: meel</p>
            <p className="display-1">Name: meel enterprise</p>
            <p> Location: Teluk Intan</p>
      </Card>
      </Col>
      <Col span={12} xs={24} md={24} xl={12}>
          <MapCard position={[4.025775268081755, 101.01862733419665]} />
        </Col>
        </Row>
    </div>
  )
}


