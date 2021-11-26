import React, { useState, useEffect } from "react";
import { Rate, List, Avatar, Comment, Tooltip, Skeleton } from "antd";
import NoAvatar from "../../../../assets/img/png/no-avatar.png";
import {
  getAvatarApi
} from "../../../../api/client";
import moment from "moment"
import {
  LikeOutlined,
  LikeFilled,
} from "@ant-design/icons";

import "./ListComments.scss";


export default function ListComments(props) {
  const { comments, isLoading } = props;
 
  if (isLoading) {
    return (
      <>
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </>
    );
  } else {
    return (
      <div className="list-items">
        <List
          className="items-active"
          itemLayout="horizontal"
          split="true"
          dataSource={comments}
          renderItem={(comment) => <CommentItem comment={comment} />}
        />
      </div>
    );
  }
}


function CommentItem(props) {
  const { comment } = props;
  const [avatar, setAvatar] = useState(null);
  const [liked, setLiked] = useState(false);

  const like = () => {
    setLiked(!liked);
  };

  useEffect(() => {
    if (comment.user.avatar) {
      getAvatarApi(comment.user.avatar).then((response) => {
        setAvatar(response);
      });
    } else {
      setAvatar(null);
    }
  }, [comment]);

  const actions = [
    <>
      <Tooltip
        key="comment-basic-like"
        title={liked ? "Agradecido!" : "Agradecer"}
      >
        <span onClick={like}>
          {liked ? <LikeFilled /> : <LikeOutlined />}
          <span className="comment-action">{liked}</span>
        </span>
      </Tooltip>
      <span>
        {liked ? " Gracias por el comentario!" : ""}
      </span>
    </>,
  ];

  return (
    <List.Item
      actions={[<Rate allowHalf disabled defaultValue={comment.rate} /> ]}
    >
      <Comment
        actions={actions}
        author={comment.user.name + comment.user.lastName}
        avatar={<Avatar size="default" src={avatar ? avatar : NoAvatar} />}
        content={<p>{comment.comment}</p>}
        datetime={
          <Tooltip title={moment(comment.created).format("DD/MM/yyyy - HH:mm")}>
            <span>{moment(comment.created).format("DD/MM/yyyy")}</span>
          </Tooltip>
        }
      />
    </List.Item>
  );
}

