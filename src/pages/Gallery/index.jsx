import { useEffect, useState } from "react"; //to import the Hooks//
import { getData, sendData } from "../../utils/api"; //to call the gallery datas from API//
import { Card, List, Divider, Input, Skeleton, Drawer, FloatButton, Form, Button, notification, Typography } from "antd"; //to import the card, list, and divider from antd design//
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  PlusCircleOutlined
} from "@ant-design/icons"; // to Import icons from the ant design
import { formatDateIndonesia, ellipsisGenerator } from "../../utils/ui"; //to get the date format in Gallery
const { Text } = Typography;

const Gallery = () => {
  
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isDrawer, setIsDrawer] = useState(false);

  useEffect(() => {
    getDataGallery();
  }, []);

  const showAlert = (status, title, description) => {
    api[status] ({
      message: title,
      description: description,
    });
  };

  const getDataGallery = () => {
    setIsLoading(true)
    getData("/api/natures")
      .then((resp) => {
        setIsLoading(false)
        if (resp) {
          setDataSource(resp);
        }
      })
      .catch((err) => {
        setIsLoading(false)
      console.log(err)
      }
      );
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  }

  let dataSourceFiltered = dataSource.filter((item) => {
    return (
      item?.name_natures.toLowerCase().includes(searchText) ||
      item?.description.toLowerCase().includes(searchText)
    );
  });

  const handleDrawer = () => {
    setIsDrawer(true);
  };

  const onCloseDrawer = () => {
    setIsDrawer(false);
  };

  const handleFormSubmit = () => {
    let nameOfNatures = form.getFieldValue("name_natures");
    let descriptionOfNatures = form.getFieldValue("description");


    let formData = new FormData()
    formData.append("name_natures", nameOfNatures)
    formData.append("description", descriptionOfNatures)


    sendData("/api/natures", formData).then(resp => {
      if(resp?.message === "OK") {
        showAlert("success", "Success", "Data Sent");
        form.resetFields() //make the form field empty
        setIsDrawer(false)
        getDataGallery()
      } else {
        showAlert("error", "Failed to send data", "Cant send data");
      } 
      }).catch(err => {
      showAlert("error", "Failded to Send data", err.toString());
   })
  };
  

  const drawerSection = () => {
    return (
        <Drawer title="Basic Drawer" onClose={onCloseDrawer} open={isDrawer} 
      extra={<Button type="primary" htmlType="submit" onClick={() => handleFormSubmit()}>
        Submit
      </Button>}>
        <Form layout="vertical" name="natures_form" form={form}>
          <Form.Item name="name_natures" placeholder="Name of Natures" label="Name of Natures" required>
            <Input placeholder="eg. Mountain"/>
          </Form.Item>
          <Form.Item name="description" placeholder="Description of Natures" label="Description of Natures" required>
            <Input.TextArea rows={4} placeholder="eg. Mountain" />
          </Form.Item>
        </Form>
      </Drawer>
      
    );
  }


  return (
    <div className="p-4 w-full">
      {contextHolder}
      <h2 className="text-2xl font-bold">Nature's Gallery</h2> 
      <p>List of Gallery</p>

      
        <FloatButton
        type="primary"
        tooltip={<div> Add gallery </div>}
        icon={<PlusCircleOutlined />}
        onClick={() => handleDrawer()}
        />
        {drawerSection()}
            
      <Input
      prefix={<SearchOutlined/>}
      placeholder="Search"
      className="header-search"
      allowClear
      size="large"
      onChange={(e) => handleSearch(e.target.value)}
      />

      <Divider />
      
      {dataSource.length > 0 && !isLoading ? (
        <List  //untuk mengecek ada data atau tidak, jika ada maka bagian setelah tanda ? akan dieksekusi, nmun jika tidak bagian setelah : akan dieksekusi.
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 3,
        }}
        dataSource={dataSourceFiltered ? dataSourceFiltered : []}
        renderItem={(item) => (
          <List.Item>
            <Card
              cover={<img src={item.url_photo} alt={item.name_natures} />} //change
              actions={[
                <EditOutlined key="edit" />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <Card.Meta
                avatar={<CheckCircleOutlined />}
                title={item.name_natures}
                description={
                  <Text 
                    ellipsis={ellipsisGenerator(item?.description)}
                  >
                    {item?.description}

                  </Text>
                }
                  
              
                  
          
                // )}`}
              />
            </Card>
          </List.Item>
          
        )}  
        
        />
        ): isLoading ? (
        <Skeleton active/>
        ): ("No Data")}    
        {/* // jika tdak ada data */}

      
    </div>
  );
};

export default Gallery;