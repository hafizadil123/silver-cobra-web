/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import axios from 'axios'
import { PageTitle } from '../../../_metronic/layout/core';
const DriverDashboardPage: FC = () => {
  const [trains,setTrains]=useState<any>([])
  const logged_user_detail: any = localStorage.getItem('logged_user_detail');
  const loggedInUserDetails = JSON.parse(logged_user_detail);

  const baseUrl = process.env.REACT_APP_API_URL;
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`;
  const getMyTrainsForInspectionEndPoint = `${baseUrl}/api/Common/GetTrainsForInspection`;
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`
    }
  }

  useEffect(() => {
    getLoggedInUserdata();
    getMyTrainsForInspection();
  }, []);
 
  const getLoggedInUserdata = async () => {
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint,{},headerJson);
    
    console.log({response})
    if (response && response.data) {
      const { data } = response;
    }
  }
  const getMyTrainsForInspection = async () => {
    const response = await axios.post(getMyTrainsForInspectionEndPoint,{},headerJson);
    
    if (response && response.data) {
      const { data } = response;
      console.log({data})
      setTrains(data.rows);
    }
  }

 
 
  return <>
    <div style={{height:'auto'}} className='main-container-dashboard'>
      <h1>{`Train Title`}</h1>
      <div className="row">
        
      </div>
     </div>
  </>
}

const DriverDashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DriverDashboardPage />
    </>
  )
}

export { DriverDashboardWrapper }
 