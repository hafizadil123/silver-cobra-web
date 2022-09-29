/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import axios from 'axios'
import { PageTitle } from '../../../_metronic/layout/core';
import {TrainsTable} from './TrainsTable';
const DriverDashboardPage: FC = () => {
  const [trains,setTrains]=useState<any>([]);
  const [actualTrains,setActualTrains]=useState<any>([]);
  const logged_user_detail: any = localStorage.getItem('logged_user_detail');
  const loggedInUserDetails = JSON.parse(logged_user_detail);
  const [search,setSearch]=useState('')
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
      setActualTrains(data.rows);
    }
  }
  
 const handleSearch =(value:any) =>{
  let searchedTrains =actualTrains.filter((item:any)=>{
    if(item.name.indexOf(value) > -1){
      return item;
    }
  })
  setSearch(value);
  setTrains(searchedTrains);
 }
 
  return <>
    <div style={{height:'auto'}} className='main-container-dashboard'>
      <h1>My Trains</h1>
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-8 col-lg-8">
              <input type="text" value={search} onChange={e=>{handleSearch(e.target.value)}} className="form-control" placeholder="Search" />
            </div>
            <div className="col-md-4 col-lg-4">
                <button type="button" className="btn btn-danger mx-3" onClick={e=>handleSearch('')}>Clear</button>
            </div>
          </div>
          <TrainsTable className='mb-5 mb-xl-8' trains={trains} />
        </div>
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
 