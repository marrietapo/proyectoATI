import React, { useState, useEffect } from "react";
import { List, Avatar, Row, Col, Calendar} from "antd";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import {
  getAvatarApi
} from "../../../../api/client";
import moment from "moment"

import "./ListReservations.scss";


export default function ListReservations(props) {
  const { reservations } = props;
  const [res, setRes] = useState(reservations)
  const [value, setValue] = useState(moment())
  const [selectedValue, setSelectedValue] = useState(moment());

  const onSelect = (value) => {
    setValue(value);
    setSelectedValue(value);
    setRes(
      reservations.filter(
        (x) =>
          moment(x.date) < moment(Date.parse(value)).endOf("day") &
          moment(x.date) > moment(Date.parse(value)).startOf("day")
      )
    );
  };
  const onPanelChange = (value) => {
    setValue(value);
  };

  useEffect(() => {
    onSelect(value);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Row>
      <Col span={11}>
        <Calendar
          value={value}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
        />
      </Col>
      <Col span={1}>
      </Col>
      <Col span={12}>
        <div className="list-items">
          <List
            className="items-active"
            itemLayout="horizontal"
            split="true"
            dataSource={res}
            renderItem={(r) => (
              <ReservationItem reservation={r} />
            )}
          />
        </div>
      </Col>
    </Row>
  );
}


function ReservationItem(props) {
  const { reservation } = props;
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (reservation.user.avatar) {
      getAvatarApi(reservation.user.avatar).then((response) => {
        setAvatar(response);
      });
    } else {
      setAvatar(null);
    }
  }, [reservation]);

  

  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={avatar ? avatar : NoAvatar} />}
        title={moment(reservation.date).format("DD/MM/yyyy - HH:mm")}
        description={reservation.user.name + " " + reservation.user.lastName}
      />
      <div>
        { "Barbero: " +
          reservation.barber.name +
          " " +
          reservation.barber.lastName}
      </div>
    </List.Item>
  );
}

