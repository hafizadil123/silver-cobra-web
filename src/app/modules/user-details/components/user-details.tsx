/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import moment from 'moment'
import {PasswordMeterComponent} from '../../../../_metronic/assets/ts/components'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './style.css'
const API_URL = process.env.REACT_APP_API_URL

const logged_user_detail: any = localStorage.getItem('logged_user_detail')
const getUser = JSON.parse(logged_user_detail)
let userType = localStorage.getItem('userType')

const userDetailValidation = Yup.object().shape({
  firstName: Yup.string().max(50, 'מקסימום 50 אותיות').required('נדרש שם פרטי'),
  volunteerNumber: Yup.string().required('נדרש מספר מתנדב'),
  email: Yup.string()
    .email('פורמט אימייל שגוי')
    .max(50, 'מקסימום 50 אותיות')
    .required('יש צורך באימייל'),
  lastName: Yup.string().max(50, 'מקסימום 50 אותיות').required('נדרש שם משפחה'),
  cellPhone: Yup.string()
    .max(10, 'אורך מקסימלי הוא 10')
    .matches(/^(0[23489]\d{7})|(0[57]\d{8})$/, 'פורמט מספר שגוי')
    .required('נדרש טלפון סלולרי'),
  phoneNumber: Yup.string()
    .max(10, 'אורך מקסימלי הוא 10')
    .matches(/^(0[23489]\d{7})|(0[57]\d{8})$/, 'פורמט שגוי'),
  idNumber: Yup.string().required('נדרש'),
  streetName: Yup.string().max(100, 'האורך המרבי הוא 100'),
  houseNumber: Yup.string().max(5, 'האורך המרבי הוא 5'),
  apartmentNumber: Yup.number()
    .required('שדה דרוש מספר דירה')
    .min(1, 'הגבלה מינימלית היא 1')
    .max(9999, 'ההגבלה המקסימלית היא 9999'),
  houseEntrance: Yup.string().max(5, 'האורך המרבי הוא 5').required('הכניסה לבית נדרשת בשדה').nullable(),
  poBox: Yup.string().max(5, 'אורך מקסימלי הוא 10').required('נדרשת תיבת דואר').nullable(),
  zipCode: Yup.string()
    .max(7, 'האורך המרבי הוא 7')
    .matches(/^[0-9]*$/)
    .required('נדרש מיקוד'),
  schoolCityCode: Yup.string().required('קוד עיר בית הספר נדרש'),
  passport: Yup.string().nullable().max(9, 'האורך המרבי הוא 9'),
  schoolCode: Yup.string().required('קוד בית ספר נדרש'),
  fatherName: Yup.string().required('שם האב נדרש').max(20, 'האורך המרבי הוא 20'),
  motherName: Yup.string().required("שם האם נדרש").max(20, 'האורך המרבי הוא 20'),
  bankCode: Yup.string(),
  bankBranch: Yup.string(),
  bankAccount: Yup.string(),
  immigrationCountryCode: Yup.string(),
  educationYears: Yup.number()
  .required('נדרש')
    .nullable()
    .min(0, 'הגבול המינימלי הוא 0')
    .max(20, 'הגבלה מקסימלית היא 20'),
  isHighEducation: Yup.boolean(),
  selectedYear: Yup.string(),
  serviceGuideCode: Yup.string(),
  isArmyInterested: Yup.boolean(),
  friendFirstName: Yup.string()
    .nullable()
    .when('serviceGuideCode', {
      is: (serviceGuideCode: any) => {
        return serviceGuideCode == 2
      },
      then: Yup.string().required('נדרש'),
    }),
  friendLastName: Yup.string()
    .nullable()
    .when('serviceGuideCode', {
      is: (serviceGuideCode: any) => {
        return serviceGuideCode == 2
      },
      then: Yup.string().required('נדרש'),
    }),
  friendCellPhone: Yup.string()
    .nullable()
    .when('serviceGuideCode', {
      is: (serviceGuideCode: any) => {
        return serviceGuideCode == 2
      },
      then: Yup.string()
        .required('נדרש')
        .matches(/^(0[23489]\d{7})|(0[57]\d{8})$/, 'פורמט שגוי'),
    }),
  genderCode: Yup.string().when('isArmyInterested', {
    is: true,
    then: Yup.string().required('נדרש'),
  }),
  // acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function UserDetails() {
  const [loading, setLoading] = useState(false)
  const [userDetails, setUserDetails] = useState<any>({})
  const [dataForFields, setGetData] = useState<any>([])
  const [show, setShowGender] = useState<any>(false)
  const [schoolCodes, setSchoolCodesArray] = useState<any>([])
  const dispatch = useDispatch()
  const location = useLocation()

  const initialValues = {
    ...userDetails,
    birthDate: moment(userDetails?.['birthDate']).format('dd-MM-yyyy'),
    // acceptTerms: false,
  }

  console.log('User Details', moment(userDetails?.['birthDate']).format('dd-MM-yyyy'))
  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    getUserDetails()
  }, [])

  useEffect(() => {
    getData()
  }, [])

  const getUserDetails = async () => {
    const logged_user_detail: any = localStorage.getItem('logged_user_detail')
    const getUser = JSON.parse(logged_user_detail)
    try {
      setLoading(true)
      const response = await axios.post(
        API_URL + '/api/Inner/GetUserDetails',
        {},
        {
          headers: {
            Authorization: `bearer ${getUser.access_token}`,
          },
        }
      )
      if (response) {
        setLoading(false)
        const {data} = response;
        console.log({data});
        // console.log('forammmm',new Date(data.birthDate))
        setStartDate(new Date(data.birthDate));
        setUserDetails(data)
        console.log('aAAAAAAAAAAAAAdataaa', data)
        if (data?.isArmyInterested) {
          setShowGender(true)
        } else {
          setShowGender(false)
        }
      }
    } catch (err) {
      console.log('Errorrrr', err)
    }
  }

  const getData = async () => {
    try {
      setLoading(true)
      const response = await axios.post(API_URL + '/api/Inner/GetData')
      if (response) {
        setLoading(false)
        const {data} = response
        setGetData(data)
        console.log('dataaa', data)
      }
    } catch (err) {
      console.log('Errorrrr', err)
    }
  }

  const getUrl = () => {
    if (userType === 'Volunteer') {
      return API_URL + '/api/Inner/UpdateUserDetails'
    }
    return API_URL + '/api/Inner/UpdateUserDetails'
  }

  const getInitialValues = (initialValues: any) => {
    if (userType !== 'Volunteer') {
      delete initialValues['volunteerNumber']
    }
    return initialValues
  }
  const formik = useFormik({
    initialValues: getInitialValues(initialValues),
    enableReinitialize: true,
    validationSchema: userDetailValidation,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      console.log('VAluesssssssss', values)
      setLoading(true)
      axios
        .post(getUrl(), values, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${getUser.access_token}`,
          },
        })
        .then((res) => {
          setLoading(false)
          if (res) {
            alert('data has been updated')
          }
        })
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  // var schools: any = []
  // for (let i = 0; i < dataForFields?.schoolCityTypes?.length; i++) {
  //   if (dataForFields.schoolCityTypes[i].id === 3002) {
  //     schools = dataForFields.schoolCityTypes[i].schools
  //   }
  // }
  // console.log('Schollsssssssss', schools)
  const handleChangeInSchoolCityTypes =(id:any) =>{
      let schoolsToPopulate = dataForFields?.schoolCityTypes?.find((item:any)=>item.id==id);
      // console.log({schoolsToPopulate});
      setSchoolCodesArray(schoolsToPopulate?.schools || []);
  } 
  const onSchoolCityCodeChange = (e:any, setFieldValue:any) => {
    const value = e.target.value;
    console.log({value})
    // setFieldValue('mail.domain', domain, false)
  }
  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='mb-10 text-center'>
        {/* begin::Title */}
        <h1 className='text-dark mb-3'>פרטי המשתמש</h1>
        {/* end::Title */}
      </div>
      {/* end::Heading */}

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      <div className='row'>

      {userType === 'Volunteer' && (
          <div className='col-xl-6'>
            <label className='class="form-label fw-bolder text-dark fs-6'>מספר מתנדב</label>
            <input
              placeholder=''
              type='text'
              autoComplete='off'
              disabled
              {...formik.getFieldProps('volunteerNumber')}
              style={{marginTop: '5px'}}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.volunteerNumber && formik.errors.volunteerNumber,
                },
                {
                  'is-valid': formik.touched.volunteerNumber && !formik.errors.volunteerNumber,
                }
              )}
            />
            {formik.touched.volunteerNumber && formik.errors.volunteerNumber && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.volunteerNumber}</span>
                </div>
              </div>
            )}
          </div>
        )}
            <div className='col-xl-6'>
          <label className='class="form-label fw-bolder text-dark fs-6'>שם פרטי</label>
          <input
            placeholder='שם פרטי'
            type='text'
            autoComplete='off'
            style={{marginTop: '5px'}}
            {...formik.getFieldProps('firstName')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.firstName && formik.errors.firstName,
              },
              {
                'is-valid': formik.touched.firstName && !formik.errors.firstName,
              }
            )}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.firstName}</span>
              </div>
            </div>
          )}
        </div>
       
       
      </div>

      <div className='row fv-row mb-7'>
      <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>שם משפחה</label>
            <input
              placeholder='שם משפחה'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('lastName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.lastName && formik.errors.lastName,
                },
                {
                  'is-valid': formik.touched.lastName && !formik.errors.lastName,
                }
              )}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.lastName}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>

        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>תעודת זהות</label>
            <input
              placeholder='תעודת זהות'
              disabled
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('idNumber')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.idNumber && formik.errors.idNumber,
                },
                {
                  'is-valid': formik.touched.idNumber && !formik.errors.idNumber,
                }
              )}
            />
            {formik.touched.idNumber && formik.errors.idNumber && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.idNumber}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
      
      </div>
      <div className='row fv-row mb-7'>
      <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>דרכון</label>
            <input
              placeholder='דרכון'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('passport')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.passport && formik.errors.passport,
                },
                {
                  'is-valid': formik.touched.passport && !formik.errors.passport,
                }
              )}
            />
            {formik.touched.passport && formik.errors.passport && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.passport}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>תאריך לידה</label>
            <DatePicker  className='form-control date-picker-custom-css'  dateFormat={'dd-MM-yyyy'} selected={startDate} onChange={ (date:Date)=>{
             formik.setFieldValue('birthDate',date);
            }} />
            {/* <input
              // placeholder='Passport'
              type='date'
              {...formik.getFieldProps('birthDate')}
              value='2022-2-2'
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.birthDate && formik.errors.birthDate,
                },
                {
                  'is-valid': formik.touched.birthDate && !formik.errors.birthDate,
                }
              )}
            /> */}
            {formik.touched.birthDate && formik.errors.birthDate && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.birthDate}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
     
      </div>
      <div className='row fv-row mb-7'>
      <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>תאריך לידה</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <select
                // name='hebYear'
                aria-label=''
                data-control='select2'
                data-placeholder='date_period'
                className='form-select form-select-sm form-select-solid'
                {...formik.getFieldProps('hebYear')}
                onChange={formik.handleChange}
              >
                {dataForFields?.hebYears?.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
                {/* <option value='last'>Within the last</option>
                <option value='between'>Between</option>
                <option value='on'>On</option> */}
              </select>
              <select
                aria-label='Select a Timezone'
                data-control='select2'
                data-placeholder='date_period'
                className='form-select form-select-sm form-select-solid'
                {...formik.getFieldProps('hebMonth')}
                onChange={formik.handleChange}
              >
                {dataForFields?.hebMonths?.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
              <select
                aria-label='Select a Timezone'
                data-control='select2'
                data-placeholder='date_period'
                className='form-select form-select-sm form-select-solid'
                {...formik.getFieldProps('hebDay')}
                onChange={formik.handleChange}
              >
                {dataForFields?.hebDays?.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* end::Form group */}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>דוא”ל</label>
            <input
              placeholder='דוא”ל'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.email && formik.errors.email,
                },
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>

      </div>
      <div className='row fv-row mb-7'>
        <div className='col-xl-6'>
          <label className='class="form-label fw-bolder text-dark fs-6'>נייד</label>
          <input
            placeholder='נייד'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('cellPhone')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.cellPhone && formik.errors.cellPhone,
              },
              {
                'is-valid': formik.touched.cellPhone && !formik.errors.cellPhone,
              }
            )}
          />
          {formik.touched.cellPhone && formik.errors.cellPhone && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.cellPhone}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='class="form-label fw-bolder text-dark fs-6'>טלפון</label>
          <input
            placeholder='טלפון'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('phoneNumber')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.phoneNumber && formik.errors.phoneNumber,
              },
              {
                'is-valid': formik.touched.phoneNumber && !formik.errors.phoneNumber,
              }
            )}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.phoneNumber}</span>
              </div>
            </div>
          )}
        </div>
      </div>  

      <div className='row fv-row mb-7'>
     {/* School city types */}
     <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>יישוב</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <select
                // name='hebYear'
                aria-label=''
                data-control='select2'
                data-placeholder='date_period'
                className='form-select form-select-sm form-select-solid'
                {...formik.getFieldProps('cityType')}
                onChange={formik.handleChange}
              >
                {dataForFields?.cityTypes?.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
          {/* end::Form group */}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>רחוב</label>
            <input
              placeholder='רחוב'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('streetName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.streetName && formik.errors.streetName,
                },
                {
                  'is-valid': formik.touched.streetName && !formik.errors.streetName,
                }
              )}
            />
            {formik.touched.streetName && formik.errors.streetName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.streetName}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>בית</label>
          <input
            placeholder='בית'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('houseNumber')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.houseNumber && formik.errors.houseNumber,
              },
              {
                'is-valid': formik.touched.houseNumber && !formik.errors.houseNumber,
              }
            )}
          />
          {formik.touched.houseNumber && formik.errors.houseNumber && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.houseNumber}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>דירה</label>
          <input
            placeholder='דירה'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('apartmentNumber')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.apartmentNumber && formik.errors.apartmentNumber,
              },
              {
                'is-valid': formik.touched.apartmentNumber && !formik.errors.apartmentNumber,
              }
            )}
          />
          {formik.touched.apartmentNumber && formik.errors.apartmentNumber && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.apartmentNumber}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>כניסה</label>
          <input
            placeholder='כניסה'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('houseEntrance')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.houseEntrance && formik.errors.houseEntrance,
              },
              {
                'is-valid': formik.touched.houseEntrance && !formik.errors.houseEntrance,
              }
            )}
          />
          {formik.touched.houseEntrance && formik.errors.houseEntrance && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.houseEntrance}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>ת.ד</label>
          <input
            placeholder='ת.ד'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('poBox')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.poBox && formik.errors.poBox,
              },
              {
                'is-valid': formik.touched.poBox && !formik.errors.poBox,
              }
            )}
          />
          {formik.touched.poBox && formik.errors.poBox && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.poBox}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>מיקוד</label>
          <input
            placeholder='מיקוד'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('zipCode')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.zipCode && formik.errors.zipCode,
              },
              {
                'is-valid': formik.touched.zipCode && !formik.errors.zipCode,
              }
            )}
          />
          {formik.touched.zipCode && formik.errors.zipCode && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.zipCode}</span>
              </div>
            </div>
          )}
        </div>
         <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>בית ספר</label>
          <select
           
            aria-label='Select School City Code'
            data-control='select2'
            data-placeholder='date_period'
            className='form-select form-select-sm form-select-solid'
            
            {...formik.getFieldProps('schoolCityCode')}
            onBlur={e=>{
              handleChangeInSchoolCityTypes(e.target.value)
            }}
            onChange={(e) => {
              const value = e.target.value;
              handleChangeInSchoolCityTypes(value);
             formik.setFieldValue('schoolCityCode',value)
              // form.setFieldValue('mail.domain', domain)
            }}
          >
            {dataForFields?.schoolCityTypes?.map((item: any) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>
          {formik.touched.schoolCityCode && formik.errors.schoolCityCode && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.schoolCityCode}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}

          <label className='form-label fw-bolder text-dark fs-6'>בית ספר</label>
          <select
          
            aria-label='Select School Code'
            data-control='select2'
            data-placeholder='date_period'
            className='form-select form-select-sm form-select-solid'
            {...formik.getFieldProps('schoolCode')}
            onChange={formik.handleChange}
          >
            {schoolCodes.map((item: any) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>
          {formik.touched.schoolCode && formik.errors.schoolCode && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.schoolCode}</span>
              </div>
            </div>
          )}
          {/* end::Form group */}
        </div>
        <div className={`${userType === 'Volunteer' ? 'col-xl-6' : 'col-xl-12'}`}>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>שם האב</label>
            <input
              placeholder='שם האב'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('fatherName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.fatherName && formik.errors.fatherName,
                },
                {
                  'is-valid': formik.touched.fatherName && !formik.errors.fatherName,
                }
              )}
            />
            {formik.touched.fatherName && formik.errors.fatherName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.fatherName}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>שם האם</label>
            <input
              placeholder='שם האם'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('motherName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.motherName && formik.errors.motherName,
                },
                {
                  'is-valid': formik.touched.motherName && !formik.errors.motherName,
                }
              )}
            />
            {formik.touched.motherName && formik.errors.motherName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.motherName}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
    
        <div className='col-xl-6'>
          <div>
            <label className='class="form-label fw-bolder text-dark fs-6'> בנק</label>
            {/* <input
              placeholder='בנק'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('bankCode')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.bankCode && formik.errors.bankCode,
                },
                {
                  'is-valid': formik.touched.bankCode && !formik.errors.bankCode,
                }
              )}
            /> */}
            <select
            // name='hebYear'
            aria-label=''
            data-control='select2'
            data-placeholder='date_period'
            className='form-select form-select-sm form-select-solid'
            {...formik.getFieldProps('bankCode')}
            onChange={formik.handleChange}
          >
            {dataForFields?.banks?.map((item: any) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>
            {formik.touched.bankCode && formik.errors.bankCode && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.bankCode}</span>
                </div>
              </div>
            )}
          </div>
 
        </div>
        <div className='col-xl-6'>
        <div>
            <label className='class="form-label fw-bolder text-dark fs-6'>סניף בנק</label>
            <input
              placeholder='סניף בנק'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('bankBranch')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.bankBranch && formik.errors.bankBranch,
                },
                {
                  'is-valid': formik.touched.bankBranch && !formik.errors.bankBranch,
                }
              )}
            />
            {formik.touched.bankBranch && formik.errors.bankBranch && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.bankBranch}</span>
                </div>
              </div>
            )}
          </div>
        </div>
           
        
        <div className='col-xl-6'>
          <label className='class="form-label fw-bolder text-dark fs-6'>חשבון בנק</label>
          <input
            placeholder='חשבון בנק'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('bankAccount')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.bankAccount && formik.errors.bankAccount,
              },
              {
                'is-valid': formik.touched.bankAccount && !formik.errors.bankAccount,
              }
            )}
          />
          {formik.touched.bankAccount && formik.errors.bankAccount && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.bankAccount}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='class="form-label fw-bolder text-dark fs-6'>מדינת עלייה</label>
          <select
            // name='hebYear'
            aria-label=''
            data-control='select2'
            data-placeholder='date_period'
            className='form-select form-select-sm form-select-solid'
            {...formik.getFieldProps('immigrationCountryCode')}
            onChange={formik.handleChange}
          >
            {dataForFields?.countryTypes?.map((item: any) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>
          {formik.touched.immigrationCountryCode && formik.errors.immigrationCountryCode && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.immigrationCountryCode}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>שנות לימוד</label>
          <input
            placeholder='שנות לימוד'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('educationYears')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.educationYears && formik.errors.educationYears,
              },
              {
                'is-valid': formik.touched.educationYears && !formik.errors.educationYears,
              }
            )}
          />
          {formik.touched.educationYears && formik.errors.educationYears && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.educationYears}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>השכלה גבוהה</label>
            <input
              type='checkbox'
              autoComplete='off'
              defaultChecked={userDetails?.['isHighEducation']}
              {...formik.getFieldProps('isHighEducation')}
            />
          </div>
          {/* end::Form group */}
        </div>
        <div className='col-xl-6'>
          <label
            className='class="form-label fw-bolder text-dark fs-6'
            style={{marginRight: '1rem'}}
          >
            מעוניינת משרד ביטחון{' '}
          </label>
          <input
            type='checkbox'
            autoComplete='off'
            defaultChecked={userDetails?.['isArmyInterested']}
            {...formik.getFieldProps('isArmyInterested')}
            onChange={() => setShowGender(!show)}
          />
          {!show && (
            <div className='col-xl-6'>
              <label
                className='class="form-label fw-bolder text-dark fs-6'
                style={{marginRight: '1rem'}}
              >
                Gender
              </label>
              <select
                style={{marginTop: '1.5rem'}}
                aria-label='Select Gender'
                data-control='select2'
                data-placeholder='date_period'
                className='form-select form-select-sm form-select-solid'
                {...formik.getFieldProps('genderCode')}
                onChange={formik.handleChange}
              >
                {dataForFields?.genderTypes?.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>תקופת שירות</label>
          <select
            style={{marginTop: '1.5rem'}}
            aria-label='Select Year'
            data-control='select2'
            data-placeholder='date_period'
            className='form-select form-select-sm form-select-solid'
            {...formik.getFieldProps('selectedYear')}
            onChange={formik.handleChange}
          >
            {dataForFields?.selectedYearTypes?.map((item: any) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>

          {formik.touched.educationYears && formik.errors.educationYears && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.educationYears}</span>
              </div>
            </div>
          )}
        </div> 
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          {console.log('Formikkkkkkkkk', formik.values)}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>איך הגעת אלינו?</label>
            <select
              style={{marginTop: '1.5rem'}}
              aria-label='Service Guide Code'
              data-control='select2'
              data-placeholder='date_period'
              className='form-select form-select-sm form-select-solid'
              {...formik.getFieldProps('serviceGuideCode')}
              onChange={formik.handleChange}
            >
              {dataForFields?.serviceGuideTypes?.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          {/* end::Form group */}
        </div>
        {formik.values.serviceGuideCode == 2 && (
          <div className='col-xl-6'>
            <label className='form-label fw-bolder text-dark fs-6'>חברה שם פרטי</label>
            <input
              placeholder='חברה שם פרטי'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('friendFirstName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.friendFirstName && formik.errors.friendFirstName,
                },
                {
                  'is-valid': formik.touched.friendFirstName && !formik.errors.friendFirstName,
                }
              )}
            />

            {formik.touched.friendFirstName && formik.errors.friendFirstName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.friendFirstName}</span>
                </div>
              </div>
            )}
          </div>
        )}
                {formik.values.serviceGuideCode == 2 && (
          <div className='col-xl-6'>
            {/* begin::Form group Lastname */}
            <div>
              <label className='form-label fw-bolder text-dark fs-6'>חברה שם משפחה</label>
              <input
                placeholder='חברה שם משפחה'
                type='text'
                autoComplete='off'
                {...formik.getFieldProps('friendLastName')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formik.touched.friendLastName && formik.errors.friendLastName,
                  },
                  {
                    'is-valid': formik.touched.friendLastName && !formik.errors.friendLastName,
                  }
                )}
              />
              {formik.touched.friendLastName && formik.errors.friendLastName && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.friendLastName}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className='form-label fw-bolder text-dark fs-6'>חברה נייד</label>
              <input
                placeholder='חברה נייד'
                type='text'
                autoComplete='off'
                {...formik.getFieldProps('friendCellPhone')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formik.touched.friendCellPhone && formik.errors.friendCellPhone,
                  },
                  {
                    'is-valid': formik.touched.friendCellPhone && !formik.errors.friendCellPhone,
                  }
                )}
              />
              {formik.touched.friendCellPhone && formik.errors.friendCellPhone && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.friendCellPhone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    

{/* Unwanted Code Starts */}



{/*<div className='row fv-row mb-7'>
        <div className='col-xl-6'>
          <label
            className='class="form-label fw-bolder text-dark fs-6'
            style={{marginRight: '1rem'}}
          >
            מעוניינת משרד ביטחון{' '}
          </label>
          <input
            type='checkbox'
            autoComplete='off'
            defaultChecked={userDetails?.['isArmyInterested']}
            {...formik.getFieldProps('isArmyInterested')}
            onChange={() => setShowGender(!show)}
          />
          {!show && (
            <div className='col-xl-6'>
              <label
                className='class="form-label fw-bolder text-dark fs-6'
                style={{marginRight: '1rem'}}
              >
                Gender
              </label>
              <select
                style={{marginTop: '1.5rem'}}
                aria-label='Select Gender'
                data-control='select2'
                data-placeholder='date_period'
                className='form-select form-select-sm form-select-solid'
                {...formik.getFieldProps('genderCode')}
                onChange={formik.handleChange}
              >
                {dataForFields?.genderTypes?.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
       
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>1111111יישוב</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <select
              
                aria-label=''
                data-control='select2'
                data-placeholder='date_period'
                className='form-select form-select-sm form-select-solid'
                {...formik.getFieldProps('cityType')}
                onChange={formik.handleChange}
              >
                {dataForFields?.cityTypes?.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
          
        </div>
      </div>


      <div className='row fv-row mb-7'>
     
        <div className='col-xl-6'>
     
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>בית</label>
            <input
              placeholder='בית'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('houseNumber')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.houseNumber && formik.errors.houseNumber,
                },
                {
                  'is-valid': formik.touched.houseNumber && !formik.errors.houseNumber,
                }
              )}
            />
            {formik.touched.houseNumber && formik.errors.houseNumber && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.houseNumber}</span>
                </div>
              </div>
            )}
          </div>
      
        </div>
      </div>

      <div className='row fv-row mb-7'>
       
        <div className='col-xl-6'>
        
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>דירה</label>
            <input
              placeholder='דירה'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('apartmentNumber')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.apartmentNumber && formik.errors.apartmentNumber,
                },
                {
                  'is-valid': formik.touched.apartmentNumber && !formik.errors.apartmentNumber,
                }
              )}
            />
            {formik.touched.apartmentNumber && formik.errors.apartmentNumber && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.apartmentNumber}</span>
                </div>
              </div>
            )}
          </div>
 
        </div>
      </div>

      <div className='row fv-row mb-7'>
        
        <div className='col-xl-6'>
         
        </div>
      </div>
    

      <div className='row fv-row mb-7'>
      
        <div className='col-xl-6'>
      
          {/* <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>PO Box</label>
            <input
              placeholder='PO Box'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('poBox')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.poBox && formik.errors.poBox,
                },
                {
                  'is-valid': formik.touched.poBox && !formik.errors.poBox,
                }
              )}
            />
            {formik.touched.poBox && formik.errors.poBox && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.poBox}</span>
                </div>
              </div>
            )}
          </div> 
     
        </div>
      </div>

      <div className='row fv-row mb-7'>
        
      
      </div>

      <div className='row fv-row mb-7'>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>מיקוד</label>
          <input
            placeholder='מיקוד'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('zipCode')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.zipCode && formik.errors.zipCode,
              },
              {
                'is-valid': formik.touched.zipCode && !formik.errors.zipCode,
              }
            )}
          />
          {formik.touched.zipCode && formik.errors.zipCode && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.zipCode}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className='row fv-row mb-7'>
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>שנות לימוד</label>
          <input
            placeholder='שנות לימוד'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('educationYears')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.educationYears && formik.errors.educationYears,
              },
              {
                'is-valid': formik.touched.educationYears && !formik.errors.educationYears,
              }
            )}
          />
          {formik.touched.educationYears && formik.errors.educationYears && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.educationYears}</span>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className='row fv-row mb-7'>
    
        <div className='col-xl-6'>
          <label className='form-label fw-bolder text-dark fs-6'>תקופת שירות</label>
          <select
            style={{marginTop: '1.5rem'}}
            aria-label='Select Year'
            data-control='select2'
            data-placeholder='date_period'
            className='form-select form-select-sm form-select-solid'
            {...formik.getFieldProps('selectedYear')}
            onChange={formik.handleChange}
          >
            {dataForFields?.selectedYearTypes?.map((item: any) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>

          {formik.touched.educationYears && formik.errors.educationYears && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.educationYears}</span>
              </div>
            </div>
          )}
        </div>
  
        <div className='col-xl-6'>
      
          {console.log('Formikkkkkkkkk', formik.values)}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>איך הגעת אלינו?</label>
            <select
              style={{marginTop: '1.5rem'}}
              aria-label='Service Guide Code'
              data-control='select2'
              data-placeholder='date_period'
              className='form-select form-select-sm form-select-solid'
              {...formik.getFieldProps('serviceGuideCode')}
              onChange={formik.handleChange}
            >
              {dataForFields?.serviceGuideTypes?.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
       
        </div>
      </div>

      <div className='row fv-row mb-7'>
        {formik.values.serviceGuideCode == 2 && (
          <div className='col-xl-6'>
            <label className='form-label fw-bolder text-dark fs-6'>חברה שם פרטי</label>
            <input
              placeholder='חברה שם פרטי'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('friendFirstName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.friendFirstName && formik.errors.friendFirstName,
                },
                {
                  'is-valid': formik.touched.friendFirstName && !formik.errors.friendFirstName,
                }
              )}
            />

            {formik.touched.friendFirstName && formik.errors.friendFirstName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.friendFirstName}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {formik.values.serviceGuideCode == 2 && (
          <div className='col-xl-6'>
          
            <div>
              <label className='form-label fw-bolder text-dark fs-6'>חברה שם משפחה</label>
              <input
                placeholder='חברה שם משפחה'
                type='text'
                autoComplete='off'
                {...formik.getFieldProps('friendLastName')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formik.touched.friendLastName && formik.errors.friendLastName,
                  },
                  {
                    'is-valid': formik.touched.friendLastName && !formik.errors.friendLastName,
                  }
                )}
              />
              {formik.touched.friendLastName && formik.errors.friendLastName && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.friendLastName}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className='form-label fw-bolder text-dark fs-6'>חברה נייד</label>
              <input
                placeholder='חברה נייד'
                type='text'
                autoComplete='off'
                {...formik.getFieldProps('friendCellPhone')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formik.touched.friendCellPhone && formik.errors.friendCellPhone,
                  },
                  {
                    'is-valid': formik.touched.friendCellPhone && !formik.errors.friendCellPhone,
                  }
                )}
              />
              {formik.touched.friendCellPhone && formik.errors.friendCellPhone && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.friendCellPhone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
   
      </div> */}




{/* Unwanted Code ends this will gets removed once client confirmed */}
      {/* begin::Form group */}
      {/* <div className='fv-row mb-10'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className='form-check-label fw-bold text-gray-700 fs-6'
            htmlFor='kt_login_toc_agree'
          >
            I Agree the{' '}
            <Link to='/auth/terms' className='ms-1 link-primary'>
              terms and conditions
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div> */}
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button type='submit' id='kt_sign_up_submit' className='btn btn-lg btn-primary mb-5'>
          {!loading && <span className='indicator-label'>עדכון</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Form group */}
    </form>
  )
}
