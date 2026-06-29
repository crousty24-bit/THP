import React from 'react';
import { Col, Icon, List, Row } from 'antd/es';
import PublicationCard from './PublicationCard';

const PublicationList = ({ posts, onPreview }) => (
  <Row type="flex" justify="center">
    <Col sm={18} xs={24}>
      <Col span={24} className="container text-center">
        <h2>
          <Icon type="save" />
          <span className="span-icon">Publications</span>
        </h2>
        <List
          grid={{ gutter: 16, column: 3 }}
          rowKey="id"
          dataSource={posts}
          renderItem={(post, index) => (
            <PublicationCard
              imageUrl={post.imageUrl}
              onClick={() => onPreview(index)}
            />
          )}
        />
      </Col>
    </Col>
  </Row>
);

export default PublicationList;
