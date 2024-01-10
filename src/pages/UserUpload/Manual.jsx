import React from 'react'
import UploadActivitiesSideBar from '../../components/UploadActivitiesSideBar/UploadActivitiesSideBar';
import '../../components/UploadActivitiesSideBar/UploadActivitiesSideBar.css';
import UserActivitiesManager from '../../services/UserActivitiesManager';

const Manual = () => {
  return (
    <div className="user-upload-container">
      <UploadActivitiesSideBar />
      <UserActivitiesManager/>
    </div>
  )
}

export default Manual