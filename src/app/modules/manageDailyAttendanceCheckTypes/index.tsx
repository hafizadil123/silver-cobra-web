/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import DataTable, {createTheme} from 'react-data-table-component'
import {PageTitle} from '../../../_metronic/layout/core'
import {ChecksComponent} from '../../pages/dashboard/Checks'
import '../../pages/dashboard/dashboard-page.css'
import {ShowDataTable} from '../../pages/dashboard/ShowDataTable'
import {DailAttendaceTable} from './Table'
import {useToasts} from 'react-toast-notifications'
import Modal from 'react-bootstrap/Modal'

const ManageDailyAttendanceCheckTypesPage: FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const [users, setUsers] = useState<any>([])
  const [userRoles, setUserRoles] = useState<any>([])
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const [search, setSearch] = useState('')
  const [actualUsers, setActualUsers] = useState<any>([])
  const [loading, setLoading] = useState(true)
  // const [showModal,setShowModal]=useState(false);
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const [activeUser, setActiveUesr] = useState({
    name: '',
    isForCar: false,
    isForTrain: false,
    order: '',
    severity: '',
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
  const saveUserDetailsEndPoint = `${baseUrl}/api/Common/SaveDailyAttendanceCheckTypeDetails`

  const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetDailyAttendanceCheckTypes`
  const deleteDailyAttendanceCheckTypeDetails = `${baseUrl}/api/Common/DeleteDailyAttendanceCheckTypeDetails`
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
      console.log('adddddd', data)
      setUserRoles(data.userRoles)
      setActiveUesr({
        ...activeUser,
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
    let user = users.find((u: any) => u.id == id)
    return user
  }
  const getUsers = async () => {
    const response = await axios.post(getMyTrainsDailyReportEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      setUsers(data.checks)
      setActualUsers(data.checks)
      setLoading(false)
    }
  }
  const getUsersAfterUpdate = () => {
    getUsers()
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

  const saveUserDetails = async (details: any, type = 'Updated') => {
    const response = await axios.post(saveUserDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        addToast(error, {appearance: 'error', autoDismiss: true})
      })
    } else {
      setShowModal(false)
      setLoading(true)
      addToast(`Code ${type} successfully`, {appearance: 'success', autoDismiss: true})
      getUsers()
    }
  }
  const handleSearch = (value: any) => {
    value = value.toLowerCase()
    let searchedUsers =
      actualUsers &&
      actualUsers.filter((item: any) => {
        if (item.name.toLowerCase().indexOf(value) > -1) {
          return item
        }
      })
    setSearch(value)
    setUsers(searchedUsers)
  }
  const handleDeleteF = async (id: any) => {
    if (window.confirm('Are you sure you want to delete?')) {
      const response = await axios.post(deleteDailyAttendanceCheckTypeDetails, {id: id}, headerJson)

      if (response && response.data) {
        const {data} = response
        if (data.result) {
          setLoading(true)
          getUsers()
        }
      }
    }
  }

  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>ניהול רשימת בדיקות יומיות</h1>
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
                      בדיקה ה
                    </button>
                  </div>
                </div>
                <DailAttendaceTable
                  className='mb-5 mb-xl-8'
                  getSelectedUser={getSelectedUser}
                  userRoles={userRoles}
                  saveUserDetails={saveUserDetails}
                  users={users}
                  css={stickyCss}
                  getUsersAfterUpdate={getUsersAfterUpdate}
                  // ActiveEditModel={ActiveEditModel}
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
            <div className='chebox-style'>
              <div className='form-check'>
                <label>עבור קרון</label>
                <input
                  type='checkbox'
                  onChange={(e) => {
                    setActiveUesr({
                      ...activeUser,
                      isForCar: e.target.checked,
                    })
                  }}
                  checked={activeUser.isForCar}
                  className='form-check-input'
                />
              </div>
              <div className='form-check'>
                <label>עבור חיבורים</label>
                <input
                  type='checkbox'
                  checked={activeUser.isForTrain}
                  onChange={(e) => {
                    console.log('creaaa', e.target)
                    setActiveUesr({
                      ...activeUser,
                      isForTrain: e.target.checked,
                    })
                  }}
                  className='form-check-input'
                />
              </div>
            </div>
            <div className='form-group'>
              <label>סדר</label>
              <input
                type='number'
                value={activeUser.order}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    order: e.target.value,
                  })
                }}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>חומרה</label>
              <input
                type='number'
                value={activeUser.severity}
                onChange={(e) => {
                  setActiveUesr({
                    ...activeUser,
                    severity: e.target.value,
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
                // setShowModal(false)
                handleUpdateUser()
              }}
              className='btn btn-primary'
            >
              הוסף בדיקה יומית
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const ManageDailyAttendanceCheckTypesPageWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <ManageDailyAttendanceCheckTypesPage />
    </>
  )
}

export {ManageDailyAttendanceCheckTypesPageWrapper}
