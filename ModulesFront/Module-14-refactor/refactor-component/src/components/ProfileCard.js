import React from 'react';
import { Avatar, Button, Card, Col, Icon, Row } from 'antd/es';

const ProfileCard = ({
  profile,
  formattedDate,
  onEditProfile,
  onUploadPicture,
}) => (
  <Card bordered>
    <Row type="flex" align="middle" justify="center">
      <Col md={14} sm={16} xs={24}>
        <Row type="flex" justify="space-between">
          <Col span={10} className="text-center">
            <Avatar size={100} icon="user" className="profil-pic" src={profile.profilePicture} />
            <h3>{`${profile.firstname} ${profile.lastname}`}</h3>
          </Col>
          <Col span={10}>
            <p>
              <Icon type="user" className="p-icon" />
              {profile.username}
            </p>
            <p>
              <Icon type="mail" className="p-icon" />
              {profile.email}
            </p>
            <p>
              <Icon type="phone" className="p-icon" />
              {profile.phoneNumber}
            </p>
            <p>
              <Icon type="calendar" className="p-icon" />
              {formattedDate}
            </p>
          </Col>
        </Row>
      </Col>
      <Col md={10} sm={16} xs={24} className="text-center">
        <Button type="ghost" icon="setting" onClick={onEditProfile}>Edit account</Button>
        <br />
        <br />
        <Button type="ghost" icon="upload" onClick={onUploadPicture}>Upload a picture</Button>
      </Col>
    </Row>
  </Card>
);

export default ProfileCard;
