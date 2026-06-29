import React from 'react';
import { Card, List } from 'antd/es';

const PublicationCard = ({ imageUrl, onClick }) => (
  <List.Item>
    <Card bordered className="card-pubs" onClick={onClick}>
      <img src={imageUrl} width={200} height={200} alt={imageUrl} />
    </Card>
  </List.Item>
);

export default PublicationCard;
