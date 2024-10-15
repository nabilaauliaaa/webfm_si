import { useEffect, useState } from "react";
import { getData } from "../../utils/api";
import { Card, List, Divider } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"; // Import icons
import { formatDateIndonesia } from "../../utils/ui";

const Gallery = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getDataGallery();
  }, []);

  const getDataGallery = () => {
    getData("/api/natures")
      .then((resp) => {
        if (resp) {
          setDataSource(resp);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold">Nature's Gallery</h2>
      <p>This is the gallery page content editt.</p>

      <Divider />
      
      {dataSource.length > 0 ?  <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 3,
        }}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item>
            <Card
              cover={<img src={item?.url_photo} alt= {item?.name_natures} />}
              actions={[
                <EditOutlined key="edit" />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <Card.Meta
                avatar={<CheckCircleOutlined />}
                title={item?.name_natures}
                description={`Posted: ${formatDateIndonesia(
                  item?.created_at
                )}`}
              />
            </Card>
          </List.Item>
        )}
      /> : "No Data"}

     
    </div>
  );
};

export default Gallery;