/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import './dashboard-page.css'
import {ReportTable} from './Table'
import {useIdleTimer} from 'react-idle-timer'

const TrainsSummaryPage: FC = () => {
  const [checks, setChecks] = useState<any>([])
  const [selectedDate, setSelectedDate] = useState<any>('')
  const [selectedSeverity, setSelectedSeverity] = useState<any>('')
  const [thData, setThData] = useState<any>([])
  const [tBodyData, setBodyData] = useState<any>([])
  const [search, setSearch] = useState('')
  const [trains, setTrains] = useState<any>([])
  const [actualThData, setActualThData] = useState<any>([])

  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState<any>([])
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const userRole = localStorage.getItem('userType')
  console.log({
    userRole
  })
  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDriversEndPoint = `${baseUrl}/api/Common/GetDrivers`
  const getMyTrainsSummaryReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailySummaryReport`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    let date = new Date()
    let dateFormatted = moment(date).format('yyyy-MM-DD')
    setSelectedDate(dateFormatted)
    getLoggedInUserdata()
    getAllDrivers()
    getMyTrainsSummaryReport(dateFormatted)
  }, [])

  const getLoggedInUserdata = async () => {
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

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

    setTrains(updatedData)
    setThData(updatedThData)
  }
  const getMyTrainsSummaryReport = async (date: any, isLoading = true) => {
    if (isLoading) {
      setLoading(true)
    }
    const response = await axios.post(getMyTrainsSummaryReportEndPoint, {date: date}, headerJson)

    if (response && response.data) {
      const {data} = response

      let thData: any = []
      if (data.trains.length > 0) {
        // thData.push({
        //   driverId: 0,
        //   driverName: null,
        //   notes: null,
        //   status: 1,
        //   trainId: 0,
        //   trainName: '',
        //   signedByDriver:item.,
        // })
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
          signedByDriver: item.signedByDriver,
          severity: item?.severity || 0,
          time: item?.signedByDriver,
        })
      })
      console.log({thDDDDDD: thData})

      setThData(thData)
      setActualThData(thData)
      setTrains(data.trains)
      setBodyData(tBodyData)
      setChecks(data.checks)
      setLoading(false)
    }
  }

  const getAllDrivers = async () => {
    const response = await axios.post(getDriversEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      setDrivers(data.Drivers)
      //
    }
  }
  const reloadApi = (type: string, data: any) => {
    if (type == 'driver') {
      handleDriverUpdate(data)
    } else if (type == 'trainStatus') {
      handleStatusUpdate(data)
    } else if (type == 'checkValue') {
      updateCheckValueData(data)
    } else if (type == 'notes') {
      handleNotesUpdate(data)
    }

    // setLoading(true)
    // getMyTrainsSummaryReport()
  }
  const updateCheckValueData = (data: any) => {
    let updatedTrains: any = tBodyData.map((item: any) => {
      // ;
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

    setBodyData(updatedTrains)
  }
  const handleSearch = (value: any, severity: any) => {
    let searchedTrains: any = actualThData.filter((item: any) => {
      if (severity == '') {
        if (item.trainName.indexOf(value) > -1) {
          return item
        }
      } else if (severity == 0) {
        if (item.trainName.indexOf(value) > -1 && item.severity <= severity) {
          return item
        }
      } else if (severity == 1) {
        if (item.trainName.indexOf(value) > -1 && item.severity >= severity) {
          return item
        }
      }
    })

    setSearch(value)
    setThData(searchedTrains)
  }

  const onIdle = () => {
    console.log('you are idle')
    // window.location.reload();
    let dateFormatted = moment(selectedDate).format('yyyy-MM-DD')
    getMyTrainsSummaryReport(dateFormatted, false).then((res: any) => {
      console.log('ran')
      handleSearch(search, selectedSeverity)
      reset()
    })
    // Close Modal Prompt
    // Do some idle action like log out your user
  }

  const onActive = (event: any) => {
    // Close Modal Prompt
    // Do some active action
  }

  const onAction = (event: any) => {
    // Do something when a user triggers a watched event
  }
  const {isIdle, reset} = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    timeout: 1000 * 30,
    promptTimeout: 0,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange',
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: false,
    name: 'idle-timer',
    syncTimers: 0,
    leaderElection: false,
  })
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>סיכום בדיקות מכאניות יומיות</h1>
        {loading ? (
          <div className='d-flex justify-content-center mb-5'>
            <div className='spinner-border text-primary'>
              <span className='sr-only'>אנא המתן...</span>
            </div>
          </div>
        ) : (
          <>
            <div className='row'>
              <div className='col-lg-12'>
                <ReportTable
                  className='mb-5 mb-xl-8'
                  drivers={drivers}
                  trData={tBodyData}
                  thData={thData}
                  reloadApi={reloadApi}
                  selectedDate={selectedDate}
                />
               {userRole !== 'Conductor' &&
                <div className='row'>
                  <div className='row'>
                    <div className='col-md-5'>
                      <input
                        type='date'
                        className='form-control-sm mb-5'
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value)
                        }}
                      />
                      <button
                        className='btn btn-primary'
                        style={{marginRight: '30px'}}
                        onClick={(e) => {
                          let date = new Date(selectedDate)
                          let dateFormatted = moment(date).format('yyyy-MM-DD')
                          getMyTrainsSummaryReport(dateFormatted)
                        }}
                      >
                        רענן
                      </button>
                    </div>
                  </div>
                  <div className='col-md-8 col-lg-8' style={{display: 'flex'}}>
                    <input
                      type='text'
                      style={{maxWidth: '200px'}}
                      value={search}
                      onChange={(e) => {
                        handleSearch(e.target.value, selectedSeverity)
                      }}
                      className='form-control'
                      placeholder='חפש לפי שם רכבת'
                    />
                    <h4 style={{lineHeight: '36px', marginRight: '50px'}}>סטטוס</h4>

                    <select
                      style={{marginRight: '30px'}}
                      className='form-control-sm'
                      value={selectedSeverity}
                      onChange={(e) => {
                        setSelectedSeverity(e.target.value)
                        handleSearch(search, e.target.value)
                      }}
                    >
                      <option value=''></option>
                      <option value='1'>עם שגיאות</option>
                      <option value='0'>ללא שגיאות</option>
                    </select>
                  </div>
                  <div className='col-md-4 col-lg-4'>
                    <button
                      type='button'
                      onClick={(e) => {
                        handleSearch('', '')
                        setSelectedSeverity('')
                        setSearch('')
                      }}
                      className='btn btn-danger mx-3'
                    >
                      נקה חיפוש
                    </button>
                  </div>
                
                </div>
}
                {/* <ReportTable
                  className='mb-5 mb-xl-8'
                  drivers={drivers}
                  trData={tBodyData}
                  thData={thData}
                  reloadApi={reloadApi}
                  selectedDate={selectedDate}
                /> */}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const TrainsSummaryReportWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <TrainsSummaryPage />
    </>
  )
}

export {TrainsSummaryReportWrapper}
