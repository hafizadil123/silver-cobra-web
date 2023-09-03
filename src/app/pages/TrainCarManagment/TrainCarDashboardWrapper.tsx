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
import {useToasts} from 'react-toast-notifications'
import Modal from 'react-bootstrap/Modal'

const TrainCarDashboardPage: FC = () => {
  const [showModal, setShowModal] = useState(false)

  const [users, setUsers] = useState<any>([])
  const [userRoles, setUserRoles] = useState<any>([])
  const [carsList, setCarsList] = useState<any>([])
  const [activeType, setActiveType] = useState<any>('Created')
  const [resetPasswordMessage, setResetPasswordMessage] = useState<any>('')
  const [_initateUpdateOtherPassMessage, setInitiateOtherPassMessage] = useState<any>('')
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const [search, setSearch] = useState('')
  const [actualUsers, setActualUsers] = useState<any>([])
  const [actualCars, setActualCars] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const [errors, setErrors] = useState<any>([])

  const [activeTrainCar, setActiveTrainCar] = useState({
    name: '',
    trainName: '',
    lastUpdated: '',
    isEnabled: '',
  })
  const handleUpdateTrainCar = () => {
    //
    saveTrainCarDetails(activeTrainCar, 'Created')
  }
  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const {addToast} = useToasts()

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDataEndPoint = `${baseUrl}/api/Common/GetData`

  const GetCarsList =`${baseUrl}/api/Common/GetCarsList`
  const DeleteCar =`${baseUrl}/api/Common/DeleteCar`

  // const getUsersEndPoint = `${baseUrl}/api/Common/GetUsers`
  // const saveUserDetailsEndPoint = `${baseUrl}/api/account/SaveUserDetails`
  const SaveCarDetailsEndPoint = `${baseUrl}/api/Common/SaveCarDetails`
  
  // const resetPasswordEndPoint = `${baseUrl}/api/account/AdminResetPassword`
  // const _initateUpdateOtherPassEndPoint = `${baseUrl}/api/account/AdminChangePassword`
  // const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyReport`
  // const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }
  useEffect(() => {
    setY(window.scrollY)

    window.addEventListener('scroll', (e) => handleNavigation(e))
  }, [stickyCss])

  useEffect(() => {
    setLoading(true)
    getCarsList()
  }, [])
 
 
 

  const getSelectedCar = (id: any) => {
    let car = carsList.find((u: any) => u.id == id)
    return car
  }
 

  const getCarsList = async () => {
   
    const response = await axios.post(GetCarsList, {}, headerJson)
    console.log(response,"response")
    
    if (response && response.data) {
      const {data} = response
      console.log(data,"data")
      setCarsList(data.CarsList)
      setActualCars(data.CarsList)
      // setActualUsers(data.users)
      console.log(carsList, "CarsList")

      setLoading(false)
    }
  }
  // console.log(carsList, "CarsList")
  const handleNavigation = (e: any) => {
    const window = e.currentTarget

    if (y > window.scrollY && window.scrollY === 238) {
      setStickyCss('white')
    } else if (y < window.scrollY) {
      setStickyCss('')
    }
    setY(window.scrollY)
  }

  const handleModal = (e: any) => {
    e.preventDefault()
    setActiveTrainCar({
      name: '',
      trainName: '',
      lastUpdated: '',
      isEnabled: '',
    })
    setShowModal(true)
    setErrors([])
  }

  
  const saveTrainCarDetails = async (details: any, type = 'Updated') => {
    setActiveType(type)

    const response = await axios.post(SaveCarDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      setLoading(true)
      if (type == 'Created') {
        setActiveTrainCar({
          name: '',
          trainName: '',
          lastUpdated: '',
          isEnabled: '',
        })
        addToast(response.data.message, {appearance: 'success', autoDismiss: true})
      } else {
        addToast(`User ${type} successfully`, {appearance: 'success', autoDismiss: true})
      }
      getCarsList()
    }
  }

  const handleSearch = (value: any) => {
    value = value.toLowerCase()
    // let searchedUsers = actualUsers.filter((item: any) => {
      let searchedCars = actualCars.filter((item: any) => {
      if (
        item.name.toLowerCase().indexOf(value) > -1 ||
        item.trainName.toLowerCase().indexOf(value) > -1 
        // item.name.toLowerCase().indexOf(value) > -1 ||
        // item.email.toLowerCase().indexOf(value) > -1 ||
        // item.userName.toLowerCase().indexOf(value) > -1 ||
        // item.mobile.toLowerCase().indexOf(value) > -1 ||
        // item.UserRoleName.toLowerCase().indexOf(value) > -1
      ) {
        return item
      }
    })
    setSearch(value)
    // setUsers(searchedUsers)
    setCarsList(searchedCars)
  }



  const handleDeleteF = async (id: any) => {
    if (window.confirm('Are you sure you want to delete?')) {
      const response = await axios.post(DeleteCar, {id: id}, headerJson)

      if (response && response.data) {
        const {data} = response
        if (data.result) {
          setLoading(true)
          // getUsers()
          getCarsList()
        }
      }
    }
  }
  const getUsersAfterUpdate = () => {
    // getUsers()
    getCarsList()
  }

  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        {/* <h1>ניהול משתמשים </h1> */}
        <h1>ניהול קרונות</h1>
        
        <div className='row'>
          <div className='col-lg-12'>
            <div className='row'>
              <div className='col-md-8 col-lg-8'>
                <input
                  type='text'
                  className='form-control'
                  value={search}
                  onChange={(e) => {
                    handleSearch(e.target.value)
                  }}
                  placeholder='חיפוש'
                />
              </div>
              <div className='col-md-4 col-lg-4'>
                <button
                  type='button'
                  className='btn btn-danger mx-3'
                  onClick={(e) => handleSearch('')}
                >
                  נקה חיפוש
                </button>
              </div>
            </div>
            {loading ? (
              <div className='d-flex justify-content-center mb-5'>
                <div className='spinner-border text-primary'>
                  <span className='sr-only'>אנא המתן...</span>
                </div>
              </div>
            ) : (
              <>
                <div className='row mb-5 mt-5'>
                  <div className='col-12'>
                    <button
                      className='btn btn-primary handleSubmit'
                      onClick={(e) => handleModal(e)}
                    >
                      הוסף משתמש
                    </button>
                  </div>
                </div>
                <ReportTable
                  className='mb-5 mb-xl-8'
                  // getSelectedUser={getSelectedUser}
                  getSelectedCar={getSelectedCar}
                  // userRoles={userRoles}
                  // saveUserDetails={saveUserDetails}
                  // users={users}
                  carsList={carsList}
                  css={stickyCss}
                  // resetUserPassword={resetUserPassword}
                  // _initiateOtherPass={_initiateOtherPass}
                  // _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                  // resetPasswordMessage={resetPasswordMessage}
                  // getUsers={getUsers}
                  getCarsList={getCarsList}
                  getUsersAfterUpdate={getUsersAfterUpdate}
                  handleDelete={(id: any) => handleDeleteF(id)}

                />
              </>
            )}
          </div>
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
            {errors &&
              errors.length > 0 &&
              errors.map((item: any) => (
                <>
                  <span style={{color: 'red'}}>{item}</span>
                  <br />
                </>
              ))}
            <div className='form-group'>
              <label>שם קרון</label>
              <input
                type='text'
                value={activeTrainCar.name}
                onChange={(e) => {
                  setActiveTrainCar({
                    ...activeTrainCar,
                    name: e.target.value,
                  })
                }}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>שם רכבת</label>
              <input
                type='text'
                onChange={(e) => {
                  setActiveTrainCar({
                    ...activeTrainCar,
                    trainName: e.target.value,
                  })
                }}
                value={activeTrainCar.trainName}
                className='form-control'
              />
            </div>
            
            {/* <div className='form-group'>
              <label>תאריך עדכון אחרון</label>
              <input
                type='text'
                readOnly
                // onChange={(e) => {
                //   setActiveTrainCar({
                //     ...activeTrainCar,
                //     lastUpdated: e.target.value,
                //   })
                // }}
                value={activeTrainCar.lastUpdated}
                className='form-control'
              />
            </div> */}
            
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
              onClick={() => {
                setShowModal(false)
                handleUpdateTrainCar()
              }}
              className='btn btn-primary'
            >
              שמירה
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const TrainCarDashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <TrainCarDashboardPage />
    </>
  )
}

export {TrainCarDashboardWrapper}
