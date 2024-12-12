import React from 'react';
import { Card, Table, Button } from 'antd';


const TableCard = ({ columns, data, title}) => {
  return (
    <Card title={title} bordered={false}>
      <Table dataSource={data} columns={columns} scroll={{ x: 400 }} />
    </Card>
  );
};

export default TableCard;
