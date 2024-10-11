import { Table, Col, Row, Typography, Card } from "antd";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const OrderPage = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  const annualDataSource = [
    {
      key: '1',
      product: 'Bag',
      qty: 32,
      total: '1.000.000',
    },
    {
      key: '2',
      product: 'Shoes',
      qty: 42,
      total: '2.000.000',
    },
  ];

  const monthlyDataSource = [
    {
      key: '1',
      product: 'Bag',
      qty: 100,
      total: '11.000.000',
    },
    {
      key: '2',
      product: 'Shoes',
      qty: 50,
      total: '24.000.000',
    },
  ];


  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>

        
        <Col xs={24} md={12} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title>Annual Orders</Title>
            <Text style={{ fontSize: "12pt" }}>Data Orders in Annuals</Text>
            {/* Tambahkan Tabel di sini */}
            <Table dataSource={annualDataSource} columns={columns} />
          </Card>
        </Col>


        <Col xs={22} md={12} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title>Monthly Orders</Title>
            <Text style={{ fontSize: "12pt" }}>Data Orders in Monthly</Text>
            {/* Tambahkan Tabel di sini */}
            <Table dataSource={monthlyDataSource} columns={columns} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderPage;
