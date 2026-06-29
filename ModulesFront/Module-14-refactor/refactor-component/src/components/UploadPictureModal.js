import React from 'react';
import { Col, Input, Modal, Row } from 'antd/es';
import MentionsTagsComponent from '../MentionsTagsComponent';

const UploadPictureModal = ({
  visible,
  description,
  hashtags,
  onCancel,
  onUpload,
  onDescriptionChange,
  onHashtagsChange,
  onMentionsChange,
}) => (
  <Modal
    title="Upload a picture"
    okText="Upload"
    visible={visible}
    onOk={onUpload}
    onCancel={onCancel}
  >
    <Row type="flex" justify="center" className="input-container">
      <Col span={20}>
        <b>Description:</b>
        <Input
          id="description"
          title="Description"
          type="text"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
      </Col>
    </Row>
    <MentionsTagsComponent
      type="mentions"
      title="Mention a user"
      setValue={onMentionsChange}
    />
    <MentionsTagsComponent
      type="tags"
      value={hashtags}
      title="Hashtags"
      setValue={onHashtagsChange}
    />
  </Modal>
);

export default UploadPictureModal;
