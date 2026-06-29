import React from 'react';
import { Col, Input, Modal, Row } from 'antd/es';

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
    <Row type="flex" justify="center" className="input-container">
      <Col span={20}>
        <b>EMail</b>
        <Input id="email" type="text" value={email} onChange={(event) => onEmailChange(event.target.value)} />
      </Col>
    </Row>
    <Row type="flex" justify="center" className="input-container">
      <Col span={20}>
        <b>Firstname</b>
        <Input id="firstname" type="text" value={firstname} onChange={(event) => onFirstnameChange(event.target.value)} />
      </Col>
    </Row>
    <Row type="flex" justify="center" className="input-container">
      <Col span={20}>
        <b>Lastname</b>
        <Input id="lastname" type="text" value={lastname} onChange={(event) => onLastnameChange(event.target.value)} />
      </Col>
    </Row>
    <Row type="flex" justify="center" className="input-container">
      <Col span={20}>
        <b>Phone number</b>
        <Input id="email" type="text" value={phoneNumber} onChange={(event) => onPhoneNumberChange(event.target.value)} />
      </Col>
    </Row>
  </Modal>
);

export default EditProfileModal;
