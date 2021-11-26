import React, {useState, useEffect} from "react";
import { Card, Row, Col,Descriptions , Avatar} from "antd";
import GoogleMapReact from "google-map-react";
import { GOOGLE_MAP_API_KEY } from "./../../../utils/constants";
import Placeholder from "../../../assets/img/png/placeholder.png";
import NoAvatar from "../../../assets/img/png/no-avatar.png";
import CreateBarbershopForm from "../CreateBarbershop/CreateBarbershopForm";

import {
  getLogoApi
} from "../../../api/barbershop";


import "./MyBarbershop.scss";

export default function MyBarbershop(props) {
  const { myBarbershop, setMyBarbershop } = props;
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (myBarbershop &&myBarbershop.logo) {
      getLogoApi(myBarbershop.logo).then((response) => {
        setAvatar(response);
      });
    } else {
      setAvatar(null);
    }
  }, [myBarbershop]);

  if (myBarbershop) {
    return (
      <div className="card">
        <Card>
          <div>
            <Row className="card_row">
            <Col span={24}>
              <div className="card_logo">
                {<Avatar size={150} src={avatar ? avatar : NoAvatar} />}
              </div>
            </Col>
            </Row>
            <Descriptions
              title=""
              bordered
              column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="Nombre">
                {myBarbershop.name}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección">
                {myBarbershop.address}
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {myBarbershop.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Propietario">
                {myBarbershop.owner.name + " " + myBarbershop.owner.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Contacto">
                {myBarbershop.owner.email}
              </Descriptions.Item>
              <Descriptions.Item label=""></Descriptions.Item>
              <Descriptions.Item label="Descripción">
                {myBarbershop.description}
              </Descriptions.Item>
            </Descriptions>
          </div>


          <div className="card_item_location">
            <MapView locationData={myBarbershop.geo} />
          </div>
        </Card>
      </div>
    );
  } else {
    return <div><CreateBarbershopForm/></div>;
  }
}


const AnyReactComponent = () => <Avatar size={25} src={Placeholder} />;

function MapView(props) {

  const {locationData} = props;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
        defaultCenter={locationData}
        //center={{ lat: lat, lng: lng }}
        defaultZoom={12}
        zoom={12}
      >
        <AnyReactComponent lat={locationData.lat} lng={locationData.lng} />
      </GoogleMapReact>
    </div>
  );
}
