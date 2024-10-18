import { useEffect, useState } from "react"; //to import the Hooks//
import { getData } from "../../utils/api"; //to call the gallery datas from API//
import { Card, List, Divider, Input, Skeleton } from "antd"; //to import the card, list, and divider from antd design//
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons"; // to Import icons from the ant design
import { formatDateIndonesia } from "../../utils/ui"; //to get the date format in Gallery


const Gallery = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

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

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold">Nature's Gallery</h2> 
      <p>This is the gallery page content edit.</p>
      
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
                title={item.name_natures} //change
                // description={`Posted: ${formatDateIndonesia(
                  // item?.created_at
                description={item?.description}
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