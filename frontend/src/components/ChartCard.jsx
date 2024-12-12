import React from 'react';
import { Card } from 'antd';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
  ResponsiveContainer,
  Legend
} from 'recharts';

function LineChartCard({ data }) {

  return (
    <Card title="Sales Every Month" bordered={false}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_revenue" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

function BarChartCard({ data }) {



  return (
    <Card title="Sales per year" bordered={false}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_revenue" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};


export { BarChartCard, LineChartCard }
