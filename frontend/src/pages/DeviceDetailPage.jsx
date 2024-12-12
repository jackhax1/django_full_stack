import { React, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { Card, Row, Col, Button, Input } from 'antd';

import { UserContext } from "../App";

import UPlotChart from "../components/UplotCard"
import MapCard from "../components/MapCard";

const { TextArea } = Input;


export default function DeviceDetail() {
  const navigate = useNavigate();
  const { deviceId } = useParams();
  const [state, setState, isLoading, setIsLoading] = useContext(UserContext);

  const [deviceData, setDeviceData] = useState({ "id": "", "attributes": "", "updates": [] ,"date_created":"","last_updated":"","status":""});


  useEffect(() => {
    fetch("/backend/devices/" + deviceId + "?limit=100", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        setDeviceData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []
  )





  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px', // optional, for spacing below the title container
  };

  return (
    <div>
      <div style={containerStyle}>
        <h1>Device Detail</h1>
        <Button onClick={() => { navigate('/devices'); }}>Back</Button>
      </div>
      <Row gutter={[16, 16]}>

        <Col span={6} key='1' xs={12} md={8} xl={6}>
          <Card title="Device ID" bordered={true}>
            {deviceData["id"] ? deviceData["id"] : "None"}
          </Card>
        </Col>
        <Col span={6} key='2' xs={12} md={8} xl={6}>
          <Card title="Date Created" bordered={true}>
            {deviceData["date_created"] ? deviceData["date_created"] : "None"}
          </Card>
        </Col>
        <Col span={6} key='3' xs={12} md={8} xl={6}>
          <Card title="Last Updated" bordered={true}>
            {deviceData["last_updated"] ? deviceData["last_updated"] : "None"}
          </Card>
        </Col>
        <Col span={6} key='4' xs={12} md={8} xl={6}>
          <Card title="Status" bordered={true}>
            {deviceData["status"] ? deviceData["status"] : "None"}
          </Card>
        </Col>


        <Col span={12} key='5' xs={24} xl={8}>
          <UPlotChart title="Entity Update" data={deviceData['updates']} />
        </Col>

        <Col span={12} key='6' xs={24} xl={8}>
          <Card title="Device Attribute" bordered={false}>
            <TextArea rows={13} value={JSON.stringify(deviceData["attributes"], null, 4)}>
            </TextArea>
          </Card>
        </Col>

        <Col span={12} key='7' xs={24} xl={8}>
          <MapCard deviceData={deviceData}/>
        </Col>
      </Row>
    </div>
  )
}


