/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import DataTable, {createTheme} from 'react-data-table-component'
import {PageTitle} from '../../../_metronic/layout/core'
import {ChecksComponent} from './Checks'
import './dashboard-page.css'
import {ShowDataTable} from './ShowDataTable'
import {ReportTable} from './Table'
const DashboardPage: FC = () => {
  const [checks, setChecks] = useState<any>([])
  const [thData, setThData] = useState<any>([])
  const [tBodyData, setBodyData] = useState<any>([])
  const [search, setSearch] = useState('')
  const [trains, setTrains] = useState<any>([])
  const [actualThData, setActualThData] = useState<any>([])

  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState<any>([])
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDriversEndPoint = `${baseUrl}/api/Common/GetDrivers`
  const getMyTrainsForInspectionEndPoint = `${baseUrl}/api/Common/GetTrainsForInspection`
  const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyReport`
  const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    getLoggedInUserdata()
    getAllDrivers()
    getMyTrainsDailyReport()
    // getMyTrainsForInspection();
    // GetTrainsDailyCleaningReport();
  }, [])

  const getLoggedInUserdata = async () => {
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    console.log({response})
    if (response && response.data) {
      const {data} = response
    }
  }

  const handleDriverUpdate = (data: any) => {
    let updatedThData = thData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          driverId: data.driverId,
        }
      } else {
        return item
      }
    })
    let actualThDataUpdate = actualThData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          driverId: data.driverId,
        }
      } else {
        return item
      }
    })
    let updatedData = trains.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          driverId: data.driverId,
        }
      } else {
        return item
      }
    })
    setThData(updatedThData)
    setActualThData(actualThDataUpdate)
    setTrains(updatedData)
  }
  const handleStatusUpdate = (data: any) => {
    let updatedThData = thData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          status: data.status,
        }
      } else {
        return item
      }
    })
    let updatedData = trains.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          status: data.status,
        }
      } else {
        return item
      }
    })
    let actualThDataUpdate = actualThData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          status: data.status,
        }
      } else {
        return item
      }
    })
    setActualThData(actualThDataUpdate)

    console.log({updatedData, trains, actualThData})
    setTrains(updatedData)
    setThData(updatedThData)
  }
  const handleNotesUpdate = (data: any) => {
    let updatedThData = thData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    let updatedData = trains.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    let actualThDataUpdate = actualThData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    setActualThData(actualThDataUpdate)

    console.log({updatedData, trains, actualThData})
    setTrains(updatedData)
    setThData(updatedThData)
  }
  const getMyTrainsDailyReport = async () => {
    const response = await axios.post(getMyTrainsDailyReportEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      console.log({data})
      let thData: any = []
      if (data.trains.length > 0 && data.checks.length > 0) {
        thData.push({
          driverId: 0,
          driverName: null,
          notes: null,
          status: 1,
          trainId: 0,
          trainName: '',
        })
      }

      let tBodyData: any = []
      data.trains.forEach((item: any) => {
        thData.push({
          driverId: item.driverId,
          driverName: item.driverName,
          notes: item.notes,
          status: item.status,
          trainId: item.trainId,
          trainName: item.trainName,
        })
      })
      for (let i = 0; i < data.checks.length; i++) {
        let check = data.checks[i]
        let trData = []
        trData.push({
          carId: check.id,
          carName: check.name,
          checkId: check.id,
          checkValue: null,
          trainId: 0,
        })
        for (let j = 0; j < data.trains.length; j++) {
          let trainCheck = data.trains[j].Checks[i]
          trainCheck.trainId = data.trains[j].trainId
          console.log({trainCheck})
          trData.push(trainCheck)
        }
        tBodyData.push(trData)
      }

      // data.checks.forEach((item:any)=>{

      // })
      console.log({thData, tBodyData})
      setThData(thData)
      setActualThData(thData)
      setTrains(data.trains)
      setBodyData(tBodyData)
      setChecks(data.checks)
      setLoading(false)
    }
  }

  const getMyTrainsForInspection = async () => {
    const response = await axios.post(getMyTrainsForInspectionEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
    }
  }

  const getAllDrivers = async () => {
    const response = await axios.post(getDriversEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      setDrivers(data.Drivers)
      // console.log({drivers:data})
    }
  }
  const reloadApi = (type: string, data: any) => {
    if (type == 'driver') {
      handleDriverUpdate(data)
    } else if (type == 'trainStatus') {
      console.log({type, data})
      handleStatusUpdate(data)
    } else if (type == 'checkValue') {
      console.log('in it')
      updateCheckValueData(data)
    } else if (type == 'notes') {
      console.log('notes', data)
      handleNotesUpdate(data)
    }
    console.log('reloading api')
    // setLoading(true)
    // getMyTrainsDailyReport()
  }
  const updateCheckValueData = (data: any) => {
    console.log({data})
    let updatedTrains: any = tBodyData.map((item: any) => {
      // console.log({item});
      return item.map((_item: any) => {
        if (
          _item.trainId == data.trainId &&
          _item.checkId == data.checkid &&
          _item.carId == data.carid
        ) {
          return {
            ..._item,
            checkValue: data.checkValue,
          }
          // return _item
        } else {
          return _item
        }
      })
    })
    let updatedData = trains.map((item: any) => {
      if (item.trainId === data.trainId) {
        let updatedChecks = item.Checks.map((_item: any) => {
          if (_item.checkId == data.checkid && _item.carId == data.carid) {
            return {
              ..._item,
              checkValue: data.checkValue,
            }
          } else {
            return _item
          }
        })
        return {
          ...item,
          Checks: updatedChecks,
        }
      } else {
        return item
      }
    })
    setTrains(updatedData)
    console.log({trains, updatedData})
    setBodyData(updatedTrains)
  }
  const handleSearch = (value: any) => {
    let searchedTrains: any = actualThData.filter((item: any) => {
      if (item.trainName.indexOf(value) > -1) {
        console.log({item})
        return item
      }
    })
    console.log({searchedTrains})
    let obj = {
      driverId: 0,
      driverName: null,
      notes: null,
      status: 1,
      trainId: 0,
      trainName: '',
    }
    if (value !== '') {
      searchedTrains.unshift(obj)
    }
    // searchedTrains.unshift(obj)
    let trainIds = searchedTrains.map((item: any) => {
      return item.trainId
    })

    let _tBodyData: any = []
    console.log({checks: checks.length})
    let s = 0
    for (let i = 0; i < checks.length; i++) {
      let check: any = checks[i]
      let trData = []
      trData.push({
        carId: check.id,
        carName: check.name,
        checkId: check.id,
        checkValue: null,
        trainId: 0,
      })
      for (let j = 0; j < trains.length; j++) {
        let trainId = trains[j].trainId
        if (trainIds.includes(trainId)) {
          let trainCheck = trains[j].Checks[i]
          trainCheck.trainId = trains[j].trainId
          // console.log({trainCheck})
          trData.push(trainCheck)
        }
      }
      s++
      _tBodyData.push(trData)
    }
    console.log({_tBodyData, tBodyData, s})
    console.log({searchedTrains})
    setSearch(value)
    setThData(searchedTrains)
    setBodyData(_tBodyData)
  }
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>דיווח בדיקות מכאניות יומיות</h1>
        {loading ? (
          <div className='d-flex justify-content-center mb-5'>
            <div className='spinner-border text-primary'>
              <span className='sr-only'>Please wait...</span>
            </div>
          </div>
        ) : (
          <>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='row'>
                  <div className='col-md-8 col-lg-8'>
                    <input
                      type='text'
                      value={search}
                      onChange={(e) => {
                        handleSearch(e.target.value)
                      }}
                      className='form-control'
                      placeholder='חפש לפי שם רכבת'
                    />
                  </div>
                  <div className='col-md-4 col-lg-4'>
                    <button
                      type='button'
                      onClick={(e) => handleSearch('')}
                      className='btn btn-danger mx-3'
                    >
                      נקה חיפוש
                    </button>
                  </div>
                </div>
                <ReportTable
                  className='mb-5 mb-xl-8'
                  drivers={drivers}
                  trData={tBodyData}
                  thData={thData}
                  reloadApi={reloadApi}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const TrainsDailyReportWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {TrainsDailyReportWrapper}
