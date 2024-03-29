/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import {FormattedMessage} from 'react-intl'
import axios from 'axios'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
const loginSchema = Yup.object().shape({
  username: Yup.string().required(` שדהשם משתמש הינו חובה`),
  password: Yup.string().required(` שדהסיסמה הינו חובה`),
})
const initialValues = {
  username: '',
  password: '',
  twoFACode: '',
}
const step2Schema = Yup.object().shape({
  username: Yup.string().required(` שדהשם משתמש הינו חובה`),
  password: Yup.string().required(` שדהסיסמה הינו חובה`),
  twoFACode: Yup.string().required(` שדהסיסמה הינו חובה`),
})

export function Login(props: any) {
  const [loading, setLoading] = useState(false)
  const [oneStep, setOneStep] = useState(false)
  const API_URL = process.env.REACT_APP_API_URL
  const STEP_ONE_URL = `${API_URL}/api/account/LoginStepOne`
  const LOGIN_URL = `${API_URL}/Token`
  const userRole = localStorage.getItem('userType')
  const getLoggedInUser = async () => {
    const logged_user_detail: any = localStorage.getItem('logged_user_detail')
    const getUser = JSON.parse(logged_user_detail)
    const getUserDetailUrl = `${API_URL}/api/Common/GetLoggedInUser`
    const response = await axios.post(
      getUserDetailUrl,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${getUser.access_token}`,
        },
      }
    )
    localStorage.setItem('userType', response.data.userRole)
    localStorage.setItem('logged_in_user_firstName', response?.data?.name)
    return response.data.userRole
  }
  const formik = useFormik({
    initialValues,
    validationSchema: oneStep === true ? step2Schema : loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      try {
        setLoading(true)
        setStatus('')
        let username = values.username
        const params = new URLSearchParams()
        let password = oneStep === true ? values.twoFACode : values.password
        params.append('username', username)
        params.append('password', password)
        params.append('grant_type', 'password')
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
        if (oneStep === true) {
          const response = await axios.post(LOGIN_URL, params, config)

          if (response) {
            setLoading(false)
            const {data} = response
            localStorage.setItem('logged_user_detail', JSON.stringify(data))
            let role = await getLoggedInUser()
            let userRole = localStorage.getItem('userType')
            if (userRole === 'Admin') {
              window.location.href = '/conductor-dashboard'
            } else if (userRole === 'Driver') {
              window.location.href = '/driver-dashboard'
            } else if (userRole === 'OccUser') {
              window.location.href = '/trains-summary'
            } else if (userRole === 'Conductor') {
              window.location.href = '/conductor-dashboard'
            } else if (userRole === 'Cleaner') {
              window.location.href = '/cleaner-dashboard'
            }else if (userRole === 'UserManager') {
              window.location.href = '/user-management'
            } 
            else {
              window.location.href = '/trains-cleaning-report'
            }
          }
        } else {
          const response = await axios.post(STEP_ONE_URL, params, config)
          const data = response.data
          setLoading(false)
          if (data.result) {
            setOneStep(true)
          } else {
            setStatus(data.message || '')
          }
        }
      } catch (err) {
        console.log({err})
        setLoading(false)
        setSubmitting(false)
        setStatus('שם משתמש וסיסמא אינם תקינים, יש לנסות שנית או לפנות למוקד.')
      }
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}

      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>מערכת צ'קליסט</h1>
      </div>
      {/* begin::Heading */}

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : null}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>שם משתמש</label>

        <input
          placeholder='שם משתמש'
          {...formik.getFieldProps('username')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.username && formik.errors.username},
            {
              'is-valid': formik.touched.username && !formik.errors.username,
            }
          )}
          type='username'
          name='username'
          disabled={oneStep}
          autoComplete='off'
        />
        {formik.touched.username && formik.errors.username && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.username}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            {/* begin::Label */}
            <label className='form-label fw-bolder text-dark fs-6 mb-0'>
              <FormattedMessage id='AUTH.INPUT.PASSWORD' />
            </label>
            {/* end::Label */}
            {/* begin::Link */}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* <Link
              to='/auth/forgot-password'
              className='link-primary fs-6 fw-bolder'
              style={{marginLeft: '5px'}}
            >
              שכחת סיסמא ?
            </Link> */}
            {/* end::Link */}
          </div>
        </div>

        <input
          type='password'
          disabled={oneStep}
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {oneStep === true ? (
        <>
          <div className='fv-row mb-10'>
            <div className='d-flex justify-content-between mt-n5'>
              <div className='d-flex flex-stack mb-2'>
                {/* begin::Label */}
                <label className='form-label fw-bolder text-dark fs-6 mb-0'>קוד כניסה </label>
                {/* end::Label */}
                {/* begin::Link */}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {/* <Link
              to='/auth/forgot-password'
              className='link-primary fs-6 fw-bolder'
              style={{marginLeft: '5px'}}
            >
              שכחת סיסמא ?
            </Link> */}
                {/* end::Link */}
              </div>
            </div>
            <input
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('twoFACode')}
              placeholder='קוד כניסה'
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.twoFACode && formik.errors.twoFACode,
                },
                {
                  'is-valid': formik.touched.twoFACode && !formik.errors.twoFACode,
                }
              )}
            />
            {formik.touched.twoFACode && formik.errors.twoFACode && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.twoFACode}</span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
      {/* end::Form group */}

      {/* begin::Action */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && (
            <span className='indicator-label'>
              {<FormattedMessage id='AUTH.GENERAL.SUBMIT_BUTTON' />}
            </span>
          )}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              אנא המתן...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>

      <div className='text-center'>
        <Link className='btn btn-lg btn-outline-primary w-100 mb-5' to='/auth/forgot-password'>
          שכחתי סיסמא
        </Link>
      </div>

      {/* end::Action */}
    </form>
  )
}
