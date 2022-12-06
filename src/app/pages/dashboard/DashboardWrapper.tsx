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
  const [userRoles, setUserRoles] = useState<any>([])
  const [resetPasswordMessage, setResetPasswordMessage] = useState<any>('')
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const [search, setSearch] = useState('')
  const [actualUsers, setActualUsers] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const [errors, setErrors] =  useState<any>([]);
  const [activeUser, setActiveUesr] = useState({
    name: '',
    email: '',
    UserRoleName: '',
    mobile: '',
    userName: '',
  })
  const handleUpdateUser = () => {
    //
    saveUserDetails(activeUser, 'Created')
  }
  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const {addToast} = useToasts()

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDataEndPoint = `${baseUrl}/api/Common/GetData`
  const getUsersEndPoint = `${baseUrl}/api/Common/GetUsers`
  const saveUserDetailsEndPoint = `${baseUrl}/api/account/SaveUserDetails`
  const resetPasswordEndPoint = `${baseUrl}/api/account/AdminResetPassword`

  const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyReport`
  const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`
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
    getUsers()
    getLoggedInUserdata()
    getData()
  }, [])
  const getData = async () => {
    const response = await axios.post(getDataEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      setUserRoles(data.userRoles)
      setActiveUesr({
        ...activeUser,
        UserRoleName: data.userRoles[0].id,
      })
    }
  }
  const getLoggedInUserdata = async () => {
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

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
      setUsers(data.users)
      setActualUsers(data.users)
      setLoading(false)
    }
  }
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
    e.preventDefault();
    setActiveUesr({
      name: '',
      email: '',
      UserRoleName: '',
      mobile: '',
      userName: '',
    });
    setShowModal(true)
    setErrors([])
    
  }
  const resetUserPassword = async (userId: any) => {
    console.log({userId})
    const activeUser = users.find((user: any) => user.userId === userId)
    console.log({activeUser})
    if (activeUser) {
      const data = {
        userName: activeUser.userName,
      }
      const response = await axios.post(resetPasswordEndPoint, data, headerJson)
      console.log({data: response.data})
      const result = response.data.result
      if (result) {
        setResetPasswordMessage(response.data.message)
        setTimeout(() => {
          setResetPasswordMessage('')
        }, 45000)
        // addToast(response.data.message, {appearance: 'success', autoDismiss: true})
      } else {
        addToast(response.data.message, {appearance: 'error', autoDismiss: true})
      }
    }
  }
  const saveUserDetails = async (details: any, type = 'Updated') => {
    const response = await axios.post(saveUserDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      setLoading(true)
      if (type == 'Created') {
        addToast(response.data.message, {appearance: 'success', autoDismiss: true})
      } else {
        addToast(`User ${type} successfully`, {appearance: 'success', autoDismiss: true})
      }
      getUsers()
    }
  }
  const handleSearch = (value: any) => {
    value = value.toLowerCase()
    let searchedUsers = actualUsers.filter((item: any) => {
      if (
        item.name.toLowerCase().indexOf(value) > -1 ||
        item.email.toLowerCase().indexOf(value) > -1 ||
        item.userName.toLowerCase().indexOf(value) > -1 ||
        item.mobile.toLowerCase().indexOf(value) > -1 ||
        item.UserRoleName.toLowerCase().indexOf(value) > -1
      ) {
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
                      onClick={(e) => handleModal(e)}
                    >
                      הוסף משתמש
                    </button>
                  </div>
                </div>
                <ReportTable
                  className='mb-5 mb-xl-8'
                  getSelectedUser={getSelectedUser}
                  userRoles={userRoles}
                  saveUserDetails={saveUserDetails}
                  users={users}
                  css={stickyCss}
                  resetUserPassword={resetUserPassword}
                  resetPasswordMessage={resetPasswordMessage}
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
            {errors && errors.length > 0 && errors.map((item: any) => <><span style={{color: 'red'}}>{item}</span><br /></>)}
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
              <select
                value={activeUser.UserRoleName}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    UserRoleName: e.target.value,
                  })
                }}
                className='form-control'
              >
                {userRoles.map((role: any) => {
                  return <option value={role.id}>{role.name}</option>
                })}
              </select>
              {/* <input
                type='text'
                value={activeUser.UserRoleName}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    UserRoleName: e.target.value,
                  })
                }}
                className='form-control'
              /> */}
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
