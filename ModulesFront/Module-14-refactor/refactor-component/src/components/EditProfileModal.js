import React from 'react';
import { Col, Input, Modal, Row } from 'antd/es';

const ProfileInput = ({
  id,
  label,
  value,
  onChange,
}) => (
  <Row type="flex" justify="center" className="input-container">
    <Col span={20}>
      <b>{label}</b>
      <Input id={id} type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    </Col>
  </Row>
);

const EditProfileModal = ({
  visible,
  email,
  firstname,
  lastname,
  phoneNumber,
  onCancel,
  onUpdate,
  onEmailChange,
  onFirstnameChange,
  onLastnameChange,
  onPhoneNumberChange,
}) => (
  <Modal
    title="Edit your account"
    okText="Update"
    visible={visible}
    onOk={onUpdate}
    onCancel={onCancel}
  >
    <ProfileInput id="email" label="EMail" value={email} onChange={onEmailChange} />
    <ProfileInput id="firstname" label="Firstname" value={firstname} onChange={onFirstnameChange} />
    <ProfileInput id="lastname" label="Lastname" value={lastname} onChange={onLastnameChange} />
    <ProfileInput id="phoneNumber" label="Phone number" value={phoneNumber} onChange={onPhoneNumberChange} />
  </Modal>
);

export default EditProfileModal;
