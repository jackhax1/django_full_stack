import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';
import '../styles/custom.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis,Tooltip ,ResponsiveContainer } from 'recharts';


const UPlotChart = ({ title, data }) => {
  const chartRef = useRef(null);
  const [ datapoints, setDatapoints ] = useState([[], []]);

  useEffect(() => {
    if (data.length>0) {
      var transformedPoints = 
        data.map(item => {
            var new_point = {}
            new_point["time"] = item[0];
            new_point["temperature"] = item[1]["temperature"]
            return new_point;
        })

      console.log(transformedPoints)


      setDatapoints(transformedPoints.reverse());
    }
  }, [data])



  return (
    <Card title={title} bordered={false}>
      <ResponsiveContainer width="95%" height={300}>
        <LineChart width={600} height={300} data={datapoints}>
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );

};


export default UPlotChart;
