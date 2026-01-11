/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIdleTimer} from 'react-idle-timer'
import {useIntl} from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import './dashboard-page.css'
import {useLocation} from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import fileDownload from 'js-file-download'
// import UseIdel from './../../hooks/UseIdle'
import {ReportTable} from './Table'
const DashboardPage = () => {
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [checks, setChecks] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [actualTbodyData, setActualTBodyData] = useState([])
  const [thData, setThData] = useState([])
  const [tBodyData, setBodyData] = useState([])
  const [search, setSearch] = useState('')
  const [trainNameSearch, setTrainNameSearch] = useState('')
  const [errorStatus, setErrorStatus] = useState('')
  const [trains, setTrains] = useState([])
  const [actualThData, setActualThData] = useState([])

  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState([])
  const logged_user_detail = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const [header, setHeaders] = useState([])
  const [headerData, setHeaderData] = useState([])
  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDriversEndPoint = `${baseUrl}/api/Common/GetDrivers`
  const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyReport`
  const GetTrainsDailyReportExcelId = `${baseUrl}/api/Report/GetTrainsDailyReportExcelId`

  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  // useEffect(() => {
  //   let date
  //   let dateFormatted
  //   setLoading(true)
  //   if (selectedDate == '') {
  //     date = new Date()
  //     dateFormatted = moment(date).format('yyyy-MM-DD')
  //     getMyTrainsDailyReport(dateFormatted)
  //     return
  //   }
  //   date = new Date(selectedDate)
  //   dateFormatted = moment(date).format('yyyy-MM-DD')
  //   getMyTrainsDailyReport(dateFormatted)
  // }, [selectedDate])
  useEffect(() => {
    let date = new Date()
    let dateFormatted = moment(date).format('yyyy-MM-DD')
    setSelectedDate(dateFormatted)
    setStartDate(dateFormatted)
    setEndDate(dateFormatted)
    getLoggedInUserdata()
    getAllDrivers()
    getMyTrainsDailyReport(dateFormatted)
    // getMyTrainsForInspection();
    // GetTrainsDailyCleaningReport();
  }, [])

  const getLoggedInUserdata = async () => {
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
    }
  }

  const onIdle = () => {
    console.log('you are idle')
    let dateFormatted = moment(selectedDate).format('yyyy-MM-DD')
    getMyTrainsDailyReport(dateFormatted).then((res) => {
      console.log('ran')
      reset()
    })
    // Close Modal Prompt
    // Do some idle action like log out your user
  }

  const onActive = (event) => {
    // Close Modal Prompt
    // Do some active action
  }

  const onAction = (event) => {
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
  const handleDriverUpdate = (data) => {
    let updatedThData = thData.map((item) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          driverId: data.driverId,
        }
      } else {
        return item
      }
    })
    let actualThDataUpdate = actualThData.map((item) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          driverId: data.driverId,
        }
      } else {
        return item
      }
    })
    let updatedData = trains.map((item) => {
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
  const handleStatusUpdate = (data) => {
    let updatedThData = thData.map((item) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          status: data.status,
        }
      } else {
        return item
      }
    })
    let updatedData = trains.map((item) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          status: data.status,
        }
      } else {
        return item
      }
    })
    let actualThDataUpdate = actualThData.map((item) => {
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
  const handleNotesUpdate = (data) => {
    let updatedThData = thData.map((item) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    let updatedData = trains.map((item) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    let actualThDataUpdate = actualThData.map((item) => {
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
  const getMyTrainsDailyReport = async (date) => {
    setLoading(true)
    let pathName = location.pathname
    let splitedPath = pathName.split('/')
    console.log({splitedPath, pathName})
    let activeTrainId = splitedPath[splitedPath.length - 2]
    let activeDate = splitedPath[splitedPath.length - 1]
    console.log({activeDate})
    if (activeDate !== '' && activeDate !== 'trains-daily-report') {
      date = activeDate
      setSelectedDate(activeDate)
      // setSelectedDate()
    }
    const response = await axios.post(getMyTrainsDailyReportEndPoint, {date: date}, headerJson)

    if (response && response.data) {
      const {data} = response

      let thData = []
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

      let tBodyData = []
      data.trains.forEach((item) => {
        thData.push({
          driverId: item.driverId,
          driverName: item.driverName,
          notes: item.notes,
          status: item.status,
          trainId: item.trainId,
          trainName: item.trainName,
          signedByDriver: item.signedByDriver,
          severity: item?.severity || 0,
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
          isActive: true,
        })
        for (let j = 0; j < data.trains.length; j++) {
          let trainCheck = data.trains[j].Checks[i]
          trainCheck.trainId = data.trains[j].trainId
          trainCheck.severity = trainCheck.severity || 0
          trainCheck.isActive = trainCheck.isActive
          trData.push(trainCheck)
        }
        tBodyData.push(trData)
      }
      setThData(thData)
      setActualThData(thData)
      setTrains(data.trains)
      setBodyData(tBodyData)
      setActualTBodyData(tBodyData)
      setChecks(data.checks)
      setLoading(false)

      if (activeDate !== '' && activeDate !== 'trains-daily-report') {
        console.log('it is with name actually ')
        const urlText = activeTrainId.replaceAll('trainNameQuery', ' ')
        console.log({urlText})
        setSearch(urlText)
        handleSearchOnStart(urlText, '', thData, data.checks, data.trains)
      } else {
        console.log('daily report simple')
      }
    }
    console.log('done from here')
  }

  const getAllDrivers = async () => {
    const response = await axios.post(getDriversEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      setDrivers(data.Drivers)
      //
    }
  }
  const reloadApi = (type, data) => {
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
    // getMyTrainsDailyReport()
  }
  const updateCheckValueData = (data) => {
    let updatedTrains = tBodyData.map((item) => {
      // ;
      return item.map((_item) => {
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
    let updatedData = trains.map((item) => {
      if (item.trainId === data.trainId) {
        let updatedChecks = item.Checks.map((_item) => {
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
  const handleSearch = (value, severity) => {
    // if(severity==)
    console.log({severity, search})
    let searchedTrains = actualThData.filter((item) => {
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
    // console.log({searchedTrains: searchedTrains})

    let obj = {
      driverId: 0,
      driverName: null,
      notes: null,
      status: 1,
      trainId: 0,
      trainName: '',
    }
    if (severity !== '' || value !== '') {
      console.log('in here ssss')
      searchedTrains.unshift(obj)
    }
    // searchedTrains.unshift(obj)
    let trainIds = searchedTrains.map((item) => {
      return item.trainId
    })

    let _tBodyData = []

    let s = 0
    for (let i = 0; i < checks.length; i++) {
      let check = checks[i]
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
          //
          trData.push(trainCheck)
        }
      }
      s++
      _tBodyData.push(trData)
    }

    // setSearch(value)
    setThData(searchedTrains)
    setBodyData(_tBodyData)
  }
  const handleSearchOnStart = (value, severity, actualThData, checks, trains) => {
    let searchedTrains = actualThData.filter((item) => {
      if (severity == '') {
        if (item.trainName.indexOf(value) > -1) {
          return item
        }
      } else {
        if (item.trainName.indexOf(value) > -1 && item.severity == severity) {
          return item
        }
      }
    })
    // console.log({searchedTrains: searchedTrains})

    let obj = {
      driverId: 0,
      driverName: null,
      notes: null,
      status: 1,
      trainId: 0,
      trainName: '',
    }
    if (severity !== '' || value !== '') {
      console.log('in here ssss')
      searchedTrains.unshift(obj)
    }
    // searchedTrains.unshift(obj)
    let trainIds = searchedTrains.map((item) => {
      return item.trainId
    })

    let _tBodyData = []

    let s = 0
    for (let i = 0; i < checks.length; i++) {
      let check = checks[i]
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
          //
          trData.push(trainCheck)
        }
      }
      s++
      _tBodyData.push(trData)
    }

    // setSearch(value)
    setThData(searchedTrains)
    setBodyData(_tBodyData)
  }
  const downloadExcelFile = async () => {
    console.log(startDate, endDate, search, selectedSeverity)
    let _startDate = new Date(startDate)
    const fromDate = moment(_startDate).format('yyyy-MM-DD')
    let _endDate = new Date(endDate)
    const tillDate = moment(_endDate).format('yyyy-MM-DD')
    const dataToSend = {
      fromDate,
      tillDate,
      trainName: trainNameSearch,
      errorStatus: errorStatus,
    }
    setLoadingExcel(true)
    try {
      const response = await axios.post(GetTrainsDailyReportExcelId, dataToSend, headerJson)
      // fileDownload(response.data, 'report.xlsx')
      // console.log({response})
      if (response.data.result === true) {
        console.log({reportId: response.data.reportId})
        var link = document.createElement('a')
        const url = `${baseUrl}/api/Report/GetTrainsDailyReportExcel?reportId=${response.data.reportId}`
        link.href = url
        link.download = `${baseUrl}/api/Report/GetTrainsDailyReportExcel?reportId=${response.data.reportId}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setLoadingExcel(false)
      } else {
        setLoadingExcel(false)
      }
    } catch (error) {
      setLoadingExcel(false)

      console.log({error})
    }
  }
  // useEffect(() => {
  //  downloadExcelFile()
  // }, [startDate, endDate])
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>דיווח בדיקות מכאניות יומיות</h1>

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
                <div className='row'>
                  <div className='row'>
                    {/* <div className='col-md-5' style={{display: 'flex'}}>
                      <h4>סטטוס רכבת </h4>
                      <select
                        style={{marginRight: '30px'}}
                        className='form-control-sm'
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                      >
                        <option value=''></option>
                        <option value='1'>עם שגיאות</option>
                        <option value='0'>ללא שגיאות</option>
                      </select>
                    </div> */}
                  </div>

                  <div className='row'>
                    <div className='col-md-5'>
                      <input
                        type='date'
                        className='form-control-sm mb-5'
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value)
                          setStartDate(e.target.value)
                          setEndDate(e.target.value)
                        }}
                      />

                      <button
                        className='btn btn-primary'
                        style={{marginRight: '30px'}}
                        onClick={(e) => {
                          let date = new Date(selectedDate)
                          let dateFormatted = moment(date).format('yyyy-MM-DD')
                          getMyTrainsDailyReport(dateFormatted)
                        }}
                      >
                        רענן
                      </button>
                    </div>
                  </div>
                  <div className='col-md-8 col-lg-8' style={{display: 'flex'}}>
                    <input
                      type='text'
                      value={search}
                      style={{maxWidth: '200px'}}
                      onChange={(e) => {
                        handleSearch(e.target.value, selectedSeverity)
                        setSearch(e.target.value)
                        setTrainNameSearch(e.target.value)
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
                        setErrorStatus(e.target.value)
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
                        setTrainNameSearch('')
                        setErrorStatus('')
                      }}
                      className='btn btn-danger mx-3'
                    >
                      נקה חיפוש
                    </button>
                    <button
                      type='button'
                      onClick={(e) => {
                        setShowModal(true)
                      }}
                      className='btn btn-success mx-3'
                    >
                      הפק דוח
                    </button>
                  </div>
                </div>
                <ReportTable
                  className='mb-5 mb-xl-8'
                  drivers={drivers}
                  trData={tBodyData}
                  thData={thData}
                  reloadApi={reloadApi}
                  selectedDate={selectedDate}
                />
              </div>
            </div>
            <Modal
              show={showModal}
              style={{direction: 'rtl'}}
              onHide={() => {
                setShowModal(false)
              }}
              // style={{    minWidth: "700px"}}
              size='lg'
              backdrop='static'
              keyboard={false}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <form>
                  <div className='form-group'>
                    <label>תאריך תחילה:</label>
                    <input
                      type='date'
                      className='form-control-sm mb-5'
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value)
                      }}
                    />
                  </div>
                  <div className='form-group'>
                    <label>תאריך סיום:</label>
                    <input
                      type='date'
                      className='form-control-sm mb-5'
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value)
                      }}
                    />
                  </div>
                  <div className='form-group'>
                    <label>חפש לפי שם רכבת</label>
                    <input
                      type='text'
                      value={trainNameSearch}
                      style={{maxWidth: '200px'}}
                      onChange={(e) => {
                        setTrainNameSearch(e.target.value)
                      }}
                      className='form-control'
                      placeholder='חפש לפי שם רכבת'
                    />
                  </div>
                  <div className='form-group'>
                    <label>סטטוס</label>

                    <select
                      style={{marginRight: '30px', marginTop: '16px'}}
                      className='form-control-sm'
                      value={errorStatus}
                      onChange={(e) => {
                        setErrorStatus(e.target.value)
                      }}
                    >
                      <option value=''></option>
                      <option value='1'>עם שגיאות</option>
                      <option value='0'>ללא שגיאות</option>
                    </select>
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <div
                  className=''
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <button
                    type='button'
                    disabled={loadingExcel}
                    onClick={() => {
                      // setShowModal(false)
                      downloadExcelFile()
                    }}
                    className='btn btn-primary'
                  >
                    הפק דוח{' '}
                  </button>
                </div>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </>
  )
}

const TrainsDailyReportWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {TrainsDailyReportWrapper}
