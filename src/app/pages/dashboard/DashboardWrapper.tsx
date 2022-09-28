/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import DataTable, { createTheme } from 'react-data-table-component';
import { PageTitle } from '../../../_metronic/layout/core';
import {ChecksComponent} from './Checks'
import './dashboard-page.css'
import {ShowDataTable} from './ShowDataTable';
import {ReportTable} from './Table'
const DashboardPage: FC = () => {
 const [checks,setChecks]=useState([]);
 const [thData,setThData]=useState([]);
 const [tBodyData,setBodyData]=useState([]);
 const [drivers,setDrivers]=useState<any>([]);
  const logged_user_detail: any = localStorage.getItem('logged_user_detail');
  const loggedInUserDetails = JSON.parse(logged_user_detail);

  const baseUrl = process.env.REACT_APP_API_URL;
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`;
  const getDriversEndPoint = `${baseUrl}/api/Common/GetDrivers`;
  const getMyTrainsForInspectionEndPoint = `${baseUrl}/api/Common/GetTrainsForInspection`;
  const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyReport`;
  const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`;
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`
    }
  }

  useEffect(() => {
    getMyTrainsForInspection();
    getLoggedInUserdata();
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
    }
  }
 
 
  return <>
    <div style={{height:'auto'}} className='main-container-dashboard'>
      <h1>My Trains</h1>
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-8 col-lg-8">
              <input type="text" className="form-control" placeholder="Search" />
            </div>
            <div className="col-md-4 col-lg-4">
                <button type="button" className="btn btn-primary">Search</button>
                <button type="button" className="btn btn-danger mx-3">Clear</button>
            </div>
          </div>
          {/* <ReportTable className='mb-5 mb-xl-8' drivers={drivers} trData={tBodyData} thData={thData} /> */}

        </div>
      </div>
     </div>
  </>
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
 