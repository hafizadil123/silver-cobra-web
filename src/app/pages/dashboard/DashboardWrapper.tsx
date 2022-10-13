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

const DashboardPage: FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState<any>([])
  const [search, setSearch] = useState('')
  const [actualUsers, setActualUsers] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const [activeUser, setActiveUesr] = useState({
    name: '',
    email: '',
    UserRoleName: '',
    mobile: '',
    userName: '',
  })
  const handleUpdateUser = () => {
    // console.log({activeUser})
    saveUserDetails(activeUser)
  }
  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const {addToast} = useToasts()

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDriversEndPoint = `${baseUrl}/api/Common/GetDrivers`
  const getUsersEndPoint = `${baseUrl}/api/Common/GetUsers`
  const saveUserDetailsEndPoint = `${baseUrl}/api/Common/SaveUserDetails`

  const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyReport`
  const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    setLoading(true)
    getUsers()
    getLoggedInUserdata()
  }, [])

  const getLoggedInUserdata = async () => {
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    console.log({response})
    if (response && response.data) {
      const {data} = response
    }
  }
  const getSelectedUser = (id: any) => {
    let user = users.find((u: any) => u.userId == id)
    return user
  }
  const getUsers = async () => {
    const response = await axios.post(getUsersEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      console.log({dataaaaa: data})
      console.log({dataaaaaaaaaaaaaaa: data.users})
      setUsers(data.users)
      setActualUsers(data.users)
      setLoading(false)
    }
  }
  const saveUserDetails = async (details: any) => {
    console.log({details})
    const response = await axios.post(saveUserDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        addToast(error, {appearance: 'error', autoDismiss: true})
      })
    } else {
      setLoading(true)
      getUsers()
    }
  }
  const handleSearch = (value: any) => {
    let searchedUsers = actualUsers.filter((item: any) => {
      if (item.name.indexOf(value) > -1) {
        return item
      }
    })
    setSearch(value)
    setUsers(searchedUsers)
  }
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>ניהול משתמשים </h1>
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
                  <span className='sr-only'>Please wait...</span>
                </div>
              </div>
            ) : (
              <>
                <div className='row mb-5 mt-5'>
                  <div className='col-12'>
                    <button
                      className='btn btn-primary handleSubmit'
                      onClick={(e) => setShowModal(true)}
                    >
                      הוסף משתמש
                    </button>
                  </div>
                </div>
                <ReportTable
                  className='mb-5 mb-xl-8'
                  getSelectedUser={getSelectedUser}
                  saveUserDetails={saveUserDetails}
                  users={users}
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
            <div className='form-group'>
              <label>שם</label>
              <input
                type='text'
                value={activeUser.name}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    name: e.target.value,
                  })
                }}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>דוא"ל</label>
              <input
                type='text'
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    email: e.target.value,
                  })
                }}
                value={activeUser.email}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>תפקיד</label>
              <input
                type='text'
                value={activeUser.UserRoleName}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    UserRoleName: e.target.value,
                  })
                }}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>מספר נייד</label>
              <input
                type='text'
                value={activeUser.mobile}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    mobile: e.target.value,
                  })
                }}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>שם משתמש</label>
              <input
                type='text'
                value={activeUser.userName}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    userName: e.target.value,
                  })
                }}
                className='form-control'
              />
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
              onClick={() => {
                setShowModal(false)
                handleUpdateUser()
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

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
