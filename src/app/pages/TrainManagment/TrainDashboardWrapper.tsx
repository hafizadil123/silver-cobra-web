import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import {PageTitle} from '../../../_metronic/layout/core'
import './dashboard-page.css'
import {ReportTable} from './Table'
import {useToasts} from 'react-toast-notifications'
import Modal from 'react-bootstrap/Modal'

const TrainDashboardPage: FC = () => {
  const [showModal, setShowModal] = useState(false)

  const [trainList, setTrainList] = useState<any>([])
  const [activeType, setActiveType] = useState<any>('Created')

  const [y, setY] = useState(0)
  const [stickyCss, setStickyCss] = useState('')
  const [search, setSearch] = useState('')
  const [actualTrains, setActualTrains] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const [errors, setErrors] = useState<any>([])

  const [activeTrain, setActiveTrain] = useState({
    name: '',
    lastUpdated: '',
    lastUpdater: '',
    car1: [],
    car1Id: 0,
    car2Id: 0,
    car2: [],
    IsEnabled: '',
    id: '',
  })
  const handleUpdateTrain = () => {
    saveTrainDetails(activeTrain, 'Created')
  }
  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const {addToast} = useToasts()

  const baseUrl = process.env.REACT_APP_API_URL

  const getTrainListEndpoint = `${baseUrl}/api/Common/GetTrainsList`
  const getTrainDetailsEndpoint = `${baseUrl}/api/Common/GetTrainDetails`
  const DeleteTrain = `${baseUrl}/api/Common/DeleteTrain`

  const saveTrainDetailsEndPoint = `${baseUrl}/api/Common/SaveTrainDetails`

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
    getTrainList()
  }, [])

  const getSelectedTrain = (id: any) => {
    const response = axios.post(getTrainDetailsEndpoint, {
      id: id
    }, headerJson).then(res => {
      return res.data
    })
  
    return response
   
  }

  const getTrainList = async () => {
    const response = await axios.post(getTrainListEndpoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      setTrainList(data.TrainsList)
      setActualTrains(data.TrainsList)
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
    e.preventDefault()
    getSelectedTrain(0).then((res: any) => {
        setActiveTrain({
          name: res.name,
          car1: res.availableCars || [],
          car2: res.availableCars || [],
          lastUpdated: res.lastUpdated,
          IsEnabled: res.IsEnabled,
          car1Id: 0,
          car2Id: 0,
          lastUpdater: res.lastUpdater,
          id: res.id,
        })
        setShowModal(true)
        setErrors([])
      })
  }

  const saveTrainDetails = async (details: any, type = 'Updated') => {
    setActiveType(type)

    const response = await axios.post(saveTrainDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        // addToast(error, {appearance: 'error', autoDismiss: true});
        setErrors(response.data.validationErrors)
        setShowModal(true)
      })
    } else {
      setLoading(true)
      if (type === 'Created') {
        setActiveTrain({
            name: '',
      lastUpdated: '',
      lastUpdater: '',
      car1: [],
      car1Id: 0,
      car2Id: 0,
      car2: [],
      IsEnabled: '',
      id: '',
        })
        addToast(response.data.message || 'Train has been created successfully!', {
          appearance: 'success',
          autoDismiss: true,
        })
      } else {
        addToast(`Train ${type} successfully`, {appearance: 'success', autoDismiss: true})
      }
      getTrainList()
    }
  }

  const handleSearch = (value: any) => {
    value = value.toLowerCase()
    let searchedTrains = actualTrains.filter((item: any) => {
      if (item.name.toLowerCase().indexOf(value) > -1) {
        return item
      }
    })
    setSearch(value)
    setTrainList(searchedTrains)
  }

  const handleDeleteF = async (id: any) => {
    if (window.confirm('Are you sure you want to delete?')) {
      const response = await axios.post(DeleteTrain, {id: id}, headerJson)

      if (response && response.data) {
        const {data} = response
        if (data.result) {
          setLoading(true)
          getTrainList()
        } else {
          alert(
            data.validationErrors[0] ||
              'לא ניתן למחוק את הקרון מפני שיש לו היסטוריה, יש לכבות את הרכבת במקום'
          )
        }
      }
    }
  }

  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
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
                  getSelectedTrain={getSelectedTrain}
                  trainList={trainList}
                  css={stickyCss}
                  getTrainList={getTrainList}
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
                          <label>מעדכן אחרון car1</label>

                          <select
                            className='form-select form-select-solid'
                            data-kt-select2='true'
                            data-placeholder='Select option'
                            data-allow-clear='true'
                            onChange={(e) => {
                              setActiveTrain({
                                ...activeTrain,
                                car1Id: +(e.target.value),
                              })
                            }}
                          >
                            <option />
                            {activeTrain.car1.map((item: any) =>  <option value={item.id}>{item.name}</option>)}
                           
                          </select>
                        </div>
                        <div className='form-group'>
                          <label>מעדכן אחרון car12</label>
                          <select
                            className='form-select form-select-solid'
                            data-kt-select2='true'
                            data-placeholder='Select option'
                            data-allow-clear='true'
                            onChange={(e) => {
                              setActiveTrain({
                                ...activeTrain,
                                car2Id: +(e.target.value),
                              })
                            }}
                            
                          >
                             <option />
                            {activeTrain.car1.map((item: any) =>  <option value={item.id}>{item.name}</option>)}
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
              onClick={() => {
                setShowModal(false)
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
