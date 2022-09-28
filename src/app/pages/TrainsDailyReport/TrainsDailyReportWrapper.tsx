/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import axios from 'axios';
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
    getLoggedInUserdata();
    getAllDrivers();
    getMyTrainsDailyReport();
    // getMyTrainsForInspection();
    // GetTrainsDailyCleaningReport();
  }, []);
 
  const getLoggedInUserdata = async () => {
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint,{},headerJson);
    
    console.log({response})
    if (response && response.data) {
      const { data } = response;
    }
  }

  const getMyTrainsDailyReport = async () => {
    const response = await axios.post(getMyTrainsDailyReportEndPoint,{},headerJson);
    
    if (response && response.data) {
      const { data } = response;
      console.log({data});
      let thData:any=[];
      thData.push({
        driverId:0,
        driverName:null,
        notes:null,
        status:1,
        trainId:0,
        trainName:'Header'
      });
      let tBodyData:any=[];
      data.trains.forEach((item:any)=>{
        thData.push({
          driverId:item.driverId,
          driverName:item.driverName,
          notes:item.notes,
          status:item.status,
          trainId:item.trainId,
          trainName:item.trainName
        });
      })
      for(let i=0;i<data.checks.length;i++) {
        let check=data.checks[i];
        let trData=[];
        trData.push({
          carId:check.id,
          carName:check.name,
          checkId:check.id,
          checkValue:null,
          trainId:0
        });
        for(let j=0;j<data.trains.length;j++) {
          let trainCheck=data.trains[j].Checks[i];
            trainCheck.trainId=data.trains[j].trainId;
            console.log({trainCheck});
          trData.push(trainCheck);
        }
        tBodyData.push(trData); 
      }

      // data.checks.forEach((item:any)=>{

      // })
      console.log({thData,tBodyData});
      setThData(thData);
      setBodyData(tBodyData);
      setChecks(data.checks);

    }
  }
 
  const getMyTrainsForInspection = async () => {
    const response = await axios.post(getMyTrainsForInspectionEndPoint,{},headerJson);
    
    if (response && response.data) {
      const { data } = response;
    }
  }
 
  const getAllDrivers = async () => {
    const response = await axios.post(getDriversEndPoint,{},headerJson);
    
    if (response && response.data) {
      const { data } = response;
      setDrivers(data.Drivers)
      // console.log({drivers:data})
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
          {/* <table className="table table-bordered">
              <thead>
                <tr>
                {
                  thData.map((item:any,index)=>{
                    return (
                      <th key={index}>{item}</th>
                    )
                  })
                }
</tr>
              </thead>
              <tbody>
                {
                  tBodyData.map((item:any)=>{
                    return (
                      <tr>
                        {item.map((_item:any,index:any)=>{
                          return(
                            <td key={index}>{_item}</td>
                          )
                        })}
                      </tr>
                    )
                  })

                }

              </tbody>
          </table> */}
          <ReportTable className='mb-5 mb-xl-8' drivers={drivers} trData={tBodyData} thData={thData} />

        </div>
      </div>
     </div>
  </>
}

const TrainsDailyReportWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { TrainsDailyReportWrapper }
 