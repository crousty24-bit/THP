// Kata written by Matthieu BRAULT for the next-react formation from TheHackingProject
import React, { useState } from 'react';
import { Col, Row, message } from 'antd/es';
import EditProfileModal from './components/EditProfileModal';
import PreviewPublicationModal from './components/PreviewPublicationModal';
import ProfileCard from './components/ProfileCard';
import PublicationList from './components/PublicationList';
import UploadPictureModal from './components/UploadPictureModal';
import initialProfileData from './data/profileData';

const formatDate = (date) => {
  const newDate = new Date(date);
  return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
};

const App = () => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [previewPublicationModal, setPreviewPublicationModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(0);
  const [uploadModal, setUploadModal] = useState(false);
  const [editProfilModal, setEditProfilModal] = useState(false);
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mentions, setMentions] = useState('');
  const [email, setEmail] = useState(initialProfileData.email);
  const [phoneNumber, setPhoneNumber] = useState(initialProfileData.phoneNumber);
  const [firstname, setFirstname] = useState(initialProfileData.firstname);
  const [lastname, setLastname] = useState(initialProfileData.lastname);

  const selectedPost = profileData.posts[previewItem];

  const openPreview = (postNumber) => {
    setPreviewItem(postNumber);
    setPreviewPublicationModal(true);
  };

  const updatePic = () => {
    alert("J'update la publcation avec l'id : " + selectedPost.id);
  };

  const deletePic = () => {
    alert("Je supprime la publcation avec l'id : " + selectedPost.id);
  };

  const uploadPicture = () => {
    alert("J'upload une image avec la description : " + description + " et les hashtags " + hashtags + " et les mentions " + mentions);
  };

  const updateProfile = () => {
    setProfileData({
      ...profileData,
      email,
      firstname,
      lastname,
      phoneNumber,
    });
    setEditProfilModal(false);
    message.success('Profile well updated', 3);
  };

  return (
    <div style={{ margin: 50 }}>
      <PreviewPublicationModal
        visible={previewPublicationModal}
        post={selectedPost}
        onCancel={() => setPreviewPublicationModal(false)}
        onEdit={updatePic}
        onDelete={deletePic}
      />
      <UploadPictureModal
        visible={uploadModal}
        description={description}
        hashtags={hashtags}
        mentions={mentions}
        onCancel={() => setUploadModal(false)}
        onUpload={uploadPicture}
        onDescriptionChange={setDescription}
        onHashtagsChange={setHashtags}
        onMentionsChange={setMentions}
      />
      <EditProfileModal
        visible={editProfilModal}
        email={email}
        firstname={firstname}
        lastname={lastname}
        phoneNumber={phoneNumber}
        onCancel={() => setEditProfilModal(false)}
        onUpdate={updateProfile}
        onEmailChange={setEmail}
        onFirstnameChange={setFirstname}
        onLastnameChange={setLastname}
        onPhoneNumberChange={setPhoneNumber}
      />
      <Row type="flex" align="middle" justify="center">
        <Col sm={16} xs={24}>
          <ProfileCard
            profile={profileData}
            formattedDate={formatDate(profileData.createdAt)}
            onEditProfile={() => setEditProfilModal(true)}
            onUploadPicture={() => setUploadModal(true)}
          />
        </Col>
      </Row>
      <PublicationList posts={profileData.posts} onPreview={openPreview} />
    </div>
  );
};

export default App;
