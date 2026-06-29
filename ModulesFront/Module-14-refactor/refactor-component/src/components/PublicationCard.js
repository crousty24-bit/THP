import React from 'react';
import { Card } from 'antd/es';

const PublicationCard = ({ post, onClick }) => (
  <Card bordered className="card-pubs" onClick={onClick}>
    <img src={post.imageUrl} width={200} height={200} alt={post.imageUrl} />
  </Card>
);

export default PublicationCard;
