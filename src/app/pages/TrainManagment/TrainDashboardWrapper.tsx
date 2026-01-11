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

const TrainDashboardPage: FC = () => {
  const [showModal, setShowModal] = useState(false)

  const [users, setUsers] = useState<any>([])
  const [userRoles, setUserRoles] = useState<any>([])
  // const [carsList, setCarsList] = useState<any>([])
  const [trainsList, setTrainsList] = useState<any>([])
  const [activeType, setActiveType] = useState<any>('Created')
  const [resetPasswordMessage, setResetPasswordMessage] = useState<any>('')
  const [_initateUpdateOtherPassMessage, setInitiateOtherPassMessage] = useState<any>('')
  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const [search, setSearch] = useState('')
  const [actualTrains, setActualTrains] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const [errors, setErrors] = useState<any>([])
  const [activeTrain, setActiveTrain] = useState({
    name: '',
    car1Id: '',
    car2Id: '',
    lastUpdater: '',
    lastUpdated: '',
    id: '',
    availableCars: [] as any[],
  })
  const handleUpdateTrain = () => {
    saveTrainDetails(activeTrain, activeTrain.id ? 'Updated' : 'Created')
  }
  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const {addToast} = useToasts()

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDataEndPoint = `${baseUrl}/api/Common/GetData`

  const GetTrainsList =`${baseUrl}/api/Common/GetTrainsList`
  const DeleteTrain =`${baseUrl}/api/Common/DeleteTrain`
  const saveTrainDetailsEndPoint = `${baseUrl}/api/Common/SaveTrainDetails`
  const getTrainDetailsEndPoint = `${baseUrl}/api/Common/GetTrainDetails`
  const setTrainUsabilityEndPoint = `${baseUrl}/api/Common/SetTrainUsability`

  const getUsersEndPoint = `${baseUrl}/api/Common/GetUsers`
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
    getTrainsList()
  }, [])

  

  const getSelectedTrain = (id: any) => {
    let train = trainsList.find((u: any) => u.id == id)
    return train
  }
 
  const getTrainsList = async () => {
   
    const response = await axios.post(GetTrainsList, {}, headerJson)
    console.log(response,"response")
    
    if (response && response.data) {
      const {data} = response
      console.log(data,"data")
      setTrainsList(data.TrainsList)
      setActualTrains(data.TrainsList)
      console.log(trainsList, "trainsList")

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

  const getTrainDetails = async (id: number) => {
    try {
      const response = await axios.post(getTrainDetailsEndPoint, {id: id}, headerJson)
      if (response && response.data && response.data.result) {
        const data = response.data
        setActiveTrain({
          name: data.name || '',
          car1Id: data.car1Id != null && data.car1Id !== 0 ? String(data.car1Id) : '',
          car2Id: data.car2Id != null && data.car2Id !== 0 ? String(data.car2Id) : '',
          lastUpdater: data.lastUpdater || '',
          lastUpdated: data.lastUpdated || '',
          id: data.id ? String(data.id) : '',
          availableCars: data.availableCars || [],
        })
        setShowModal(true)
        setErrors([])
      }
    } catch (error) {
      console.error('Error fetching train details:', error)
      addToast('שגיאה בטעינת פרטי הרכבת', {appearance: 'error', autoDismiss: true})
    }
  }

  const handleModal = async (e: any) => {
    e.preventDefault()
    await getTrainDetails(0)
  }

 

  const saveTrainDetails = async (details: any, type = 'Updated') => {
    setActiveType(type)

    // Prepare data for SaveTrainDetails API
    const dataToSend = {
      id: details.id ? parseInt(details.id) : 0,
      name: details.name,
      car1Id: details.car1Id ? parseInt(details.car1Id) : null,
      car2Id: details.car2Id ? parseInt(details.car2Id) : null,
    }

    const response = await axios.post(saveTrainDetailsEndPoint, dataToSend, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      setLoading(true)
      if (type == 'Created') {
        setActiveTrain({
          name: '',
          car1Id: '',
          car2Id: '',
          lastUpdater: '',
          lastUpdated: '',
          id: '',
          availableCars: [],
        })
        addToast('הרכבת החדשה נוצרה בהצלחה', {appearance: 'success', autoDismiss: true})
      } else {
        addToast('עדכון התבצע בהצלחה', {appearance: 'success', autoDismiss: true})
      }
      setShowModal(false)
      getTrainsList()
    }
  }

  const handleSetTrainUsability = async (trainId: number, isEnabled: boolean) => {
    try {
      const response = await axios.post(setTrainUsabilityEndPoint, {
        trainId: trainId,
        isEnabled: isEnabled
      }, headerJson)
      
      if (response.data.result === true) {
        addToast('עדכון סטטוס הרכבת בוצע בהצלחה', {appearance: 'success', autoDismiss: true})
        getTrainsList()
      } else {
        addToast(response.data.message || 'שגיאה בעדכון סטטוס הרכבת', {appearance: 'error', autoDismiss: true})
      }
    } catch (error) {
      console.error('Error setting train usability:', error)
      addToast('שגיאה בעדכון סטטוס הרכבת', {appearance: 'error', autoDismiss: true})
    }
  }
  const handleSearch = (value: any) => {
    setSearch(value)
    if (!value || value === '') {
      setTrainsList(actualTrains)
      return
    }
    value = value.toLowerCase()
    let searchedTrains = actualTrains.filter((item: any) => {
      if (
        item.name.toLowerCase().indexOf(value) > -1 
      ) {
        return item
      }
    })
    setTrainsList(searchedTrains)
  }



  const handleDeleteF = async (id: any) => {
    if (window.confirm('האם בטוח למחוק את הרכבת?')) {
      const response = await axios.post(DeleteTrain, {id: id}, headerJson)

      if (response && response.data) {
        const {data} = response
        if (data.result) {
          setLoading(true)
          getTrainsList()
        }
      }
    }
  }
  const getTrainsAfterUpdate = () => {
    getTrainsList()
  }

  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>ניהול רכבות</h1>
        
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
                      הוסף רכבת
                    </button>
                  </div>
                </div>
                <ReportTable
                  className='mb-5 mb-xl-8'
                  // getSelectedUser={getSelectedUser}
                  getSelectedTrain={getSelectedTrain}
                  // userRoles={userRoles}
                  // saveUserDetails={saveUserDetails}
                  // users={users}
                  trainsList={trainsList}
                  css={stickyCss}
                  // resetUserPassword={resetUserPassword}
                  // _initiateOtherPass={_initiateOtherPass}
                  // _initateUpdateOtherPassMessage={_initateUpdateOtherPassMessage}
                  // resetPasswordMessage={resetPasswordMessage}
                  // getUsers={getUsers}
                  getTrainsList={getTrainsList}
                  getTrainsAfterUpdate={getTrainsAfterUpdate}
                  handleDelete={(id: any) => handleDeleteF(id)}
                  handleSetTrainUsability={handleSetTrainUsability}
                  getTrainDetails={getTrainDetails}

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
              <label>שם רכבת</label>
              <input
                type='text'
                maxLength={50}
                value={activeTrain.name}
                onChange={(e) => {
                  setActiveTrain({
                    ...activeTrain,
                    name: e.target.value,
                  })
                }}
                className='form-control'
              />
            </div>
            <div className='form-group'>
              <label>קרון 1</label>
              <select
                onChange={(e) => {
                  setActiveTrain({
                    ...activeTrain,
                    car1Id: e.target.value,
                  })
                }}
                value={activeTrain.car1Id}
                className='form-control'
              >
                <option value=''>בחר קרון</option>
                {activeTrain.availableCars.map((car: any) => (
                  <option key={car.id} value={String(car.id)}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>קרון 2</label>
              <select
                onChange={(e) => {
                  setActiveTrain({
                    ...activeTrain,
                    car2Id: e.target.value,
                  })
                }}
                value={activeTrain.car2Id}
                className='form-control'
              >
                <option value=''>בחר קרון</option>
                {activeTrain.availableCars.map((car: any) => (
                  <option key={car.id} value={String(car.id)}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>מעדכן אחרון</label>
              <input
                type='text'
                value={activeTrain.lastUpdater}
                className='form-control'
                readOnly
                disabled
              />
            </div>
            <div className='form-group'>
              <label>תאריך עדכון אחרון</label>
              <input
                type='text'
                value={activeTrain.lastUpdated}
                className='form-control'
                readOnly
                disabled
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
                handleUpdateTrain()
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

const TrainDashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <TrainDashboardPage />
    </>
  )
}

export {TrainDashboardWrapper}
