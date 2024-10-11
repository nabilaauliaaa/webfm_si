import { Col, Row, Typography, Card } from "antd";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const Blank = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={22} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title>Blank Page {lastSegment}</Title>
            <Text style={{ fontSize: "12pt" }}>Add content here</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Blank;
