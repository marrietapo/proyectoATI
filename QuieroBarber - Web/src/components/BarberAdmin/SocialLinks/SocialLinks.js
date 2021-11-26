import React from "react";
import { Avatar } from "antd";
import {
  YoutubeFilled,
  TwitterOutlined,
  InstagramOutlined,
  FacebookFilled,
  LinkedinFilled,
  GithubFilled

} from "@ant-design/icons";

import "./SocialLinks.scss";

export default function SocialLinks(){
    return (
      <div className="social-links">
        <a
          href="http://www.instagram.com/marrietapo"
          target="_blank"
          rel="noreferrer"
        >
          <Avatar
            size="large"
            icon={<InstagramOutlined />}
            className="social-links_instagram social-links_avatar"
          />
          <Avatar
            size="large"
            icon={<TwitterOutlined />}
            className="social-links_twitter social-links_avatar"
          />
          <Avatar
            size="large"
            icon={<YoutubeFilled />}
            className="social-links_youtube social-links_avatar"
          />
          <Avatar
            size="large"
            icon={<FacebookFilled />}
            className="social-links_facebook social-links_avatar"
          />
          <Avatar
            size="large"
            icon={<LinkedinFilled />}
            className="social-links_linkedin social-links_avatar"
          />
          <Avatar
            size="large"
            icon={<GithubFilled />}
            className="social-links_github social-links_avatar"
          />
        </a>
      </div>
    );
}