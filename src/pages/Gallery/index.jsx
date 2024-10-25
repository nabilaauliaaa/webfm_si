import { useEffect, useState } from "react"; //to import the Hooks//
import { getData, sendData, deleteData } from "../../utils/api"; //to call the gallery datas from API//
import { Card, List, Divider, Input, Skeleton, Drawer, FloatButton, Form, Button, notification, Typography, Popconfirm } from "antd"; //to import the card, list, and divider from antd design//
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

  const [isEdit, setIsEdit] = useState(false)
  const [idSelected, setIdSelected] = useState(null)

  useEffect(() => {
    getDataGallery();
  }, []);

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
    if (isEdit) {
      setIsEdit(false)
      form.resetFields()
    }
    setIsDrawer(false);
  };

  const handleDrawerEdit = (record) => {
    setIsDrawer(true)
    setIsEdit(true)
    setIdSelected(record?.id)
    form.setFieldValue("name_natures", record?.name_natures);
    form.setFieldValue("description", record?.description);
  }

  const handleFormSubmit = () => {
    let nameOfNatures = form.getFieldValue("name_natures");
    let descriptionOfNatures = form.getFieldValue("description");

    //prepare
    let formData = new FormData()
    formData.append("name_natures", nameOfNatures)
    formData.append("description", descriptionOfNatures)

    let request = !isEdit ? sendData("/api/natures", formData) : sendData("/api/natures/" + idSelected, formData);

    //sending data
    request.then(resp => {
      if(resp?.message === "OK"){
        setIsEdit(false);
        showAlert("success", "success", "Data Edited");
        setIdSelected(null);
        showAlert("success", "Success", "Data send");
        form.resetFields() //make the form field empty
        setIsDrawer(false)
        getDataGallery()
  
      }else{
        showAlert("error", "Failed to send data", "Cant send data");
      }
    }).catch(err=> {
      setIsEdit(false);
      setIdSelected(null);
      showAlert("error", "Failed to end data", err.toString());
    })

    
  };

  const confirmDelete = (record_id) => {
    let url =`/api/natures/${record_id}`;
    let params = new URLSearchParams();
    params.append("id", record_id);


    deleteData(url, params)
    .then((resp) => {
     
      if(resp?.status === 200) {
        showAlert("success", "Data deleted", "Data berhasil terhapus");
        getDataGallery();
        form.resetFields();
        getDataGallery();
        onCloseDrawer();
      } else {
        showAlert("error", "Failed", "Data gagal terhapus");
      }
    })
    .catch((err) => {
      console.log(err);
      showAlert("error", "Failed", "Data gagal terhapus");
    });
  };

  const drawerSection = () => {
    return (
      <Drawer 
      title="Basic Drawer" 
      onClose={onCloseDrawer} open={isDrawer} 
      extra={<Button 
      htmlType="submit" 
      style={{background : isEdit ? "green" : "blue", color: "white"}}
      onClick={() => handleFormSubmit()}>

        {isEdit ? "Apply" : "Submit"}
      

      </Button>}>
        <Form layout="vertical" name="natures_form" form={form}>
          <Form.Item name="name_natures" placeholder="Name of Natures" label="Name of Natures" required>
            <Input placeholder="eg. Mountain"/>
          </Form.Item>
          <Form.Item name="description" placeholder="Description of Natures" label="Description of Natures" required>
            <Input.TextArea rows={4} placeholder="e.g Mountain"/>
          </Form.Item>
        </Form>
      </Drawer>
    )
  }

  const showAlert = (status, title, description) => {
    api[status]({
      message:title,
      description: description,
    });
  };

  return (
    <div className="p-4 w-full">
      {contextHolder}
      <h2 className="text-2xl font-bold">Nature's Gallery</h2> 
      <p>This is the page of Gallery of the Natures.</p>

      {/* <Card bordered={false} className="circlebox h-full w-full"> */}
        <FloatButton
          type="primary"
          tooltip={ <div>Add Gallery</div>}
          icon={<PlusCircleOutlined/>} 
          onClick={() => handleDrawer()}
        />
        {drawerSection()}
      {/* </Card>
       */}
      <Input
      prefix={<SearchOutlined/>}
      placeholder="input search text"
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
                <EditOutlined 
                  key="edit"
                  onClick={() => handleDrawerEdit(item)}
                />,
              <Popconfirm
                key={item?.id}
                title="Delete the gallery"
                description="Are you sure to delete this gallery?"
                onConfirm={() => confirmDelete(item?.id)}
                okText="Yes"
                cancelText="No"
              >
                 <DeleteOutlined key="delete" />
                </Popconfirm>,
              ]}
            >

               
              <Card.Meta
                avatar={<CheckCircleOutlined />}
                title={item.name_natures} //change
                // description={`Posted: ${formatDateIndonesia(
                  // item?.created_at
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