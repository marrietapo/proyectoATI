import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Avatar} from "antd";
import GoogleMapReact from "google-map-react";
import { GOOGLE_MAP_API_KEY } from "./../../../../utils/constants";
import Placeholder from "../../../../assets/img/png/placeholder.png";



import "./PickUpLocation.scss";


export default function PickUpLocation(props) {

  const {locationData, setLocationData} = props;


      const onFormLayoutChange = () => {};
      const onFinish = (values) => {
        console.log("Success:", values);
      };

      const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
      };

      const { TextArea } = Input;
    return (
      <Row>
        <Col span={16}>
          <div className="ver">
            <MapView
              locationData={locationData}
              setLocationData={setLocationData}
            />
          </div>
        </Col>
        <Col span={8}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="horizontal"
            onValuesChange={onFormLayoutChange}
            size="large"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Dirección"
              rules={[{ required: true, message: "Ingrese un Nombre" }]}
            >
              <TextArea
                name="address"
                className="register-form_textarea"
                placeholder="Ingrese una Dirección"
                autoSize={{ minRows: 4, maxRows: 8 }}
                value={locationData.address}
                onChange={(e) =>
                  setLocationData({
                    ...locationData,
                    address: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item className="coords">
              <span>Latitud: {locationData.coords.latitud}</span>
            </Form.Item>
            <Form.Item className="coords">
              <span>Longitud: {locationData.coords.longitud}</span>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
}
const AnyReactComponent = () => <Avatar size={25} src={Placeholder} />;

function MapView(props) {

  const {locationData, setLocationData} = props;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLat(latitude);
        setLng(longitude);
        setDefaultCenter({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  const [defaultCenter, setDefaultCenter] = useState({});
  const [lat, setLat] = useState(-34.9);
  const [lng, setLng] = useState(-56.2);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
        defaultCenter={defaultCenter}
        //center={{ lat: lat, lng: lng }}
        defaultZoom={12}
        zoom={12}
        onClick={(e) => {
          setLat(e.lat);
          setLng(e.lng);
          setLocationData({ ...locationData, coords: {longitud: e.lng, latitud:e.lat}});
        }}
      >
        <AnyReactComponent lat={lat} lng={lng} />
      </GoogleMapReact>
    </div>
  );
}