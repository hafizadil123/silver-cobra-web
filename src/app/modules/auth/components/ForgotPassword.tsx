import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import axios from 'axios'
import {FormattedMessage} from 'react-intl'
const API_URL = process.env.REACT_APP_API_URL

const initialValues = {
  contanctInfo: '',
  userName: '',
}

const forgotPasswordSchema = Yup.object().shape({
  contanctInfo: Yup.string().required(),
  userName: Yup.string().required('Required'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      console.log('contanctInfo', values.contanctInfo, values.userName)
      try {
        setLoading(true)
        setStatus('')
        const response = await axios.post(
          API_URL + '/api/Inner/RecoverPassword',
          {userName: values.userName, contanctInfo: values.contanctInfo},
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        if (response) {
          console.log('Responseeee', response)
          // setStatus(msg)
          setHasErrors(false)
          setLoading(false)
          const {data} = response
          console.log('dataaa', data)
          if(data.result) {
            setStatus('שחזור סיסמאות נשלח, אנא המתן מפנים אותך בכניסה')
            setTimeout(() => {
                 window.location.href = '/auth';
            }, 3000)
          // window.location.href = '/dashboard';
          } else  {
            setStatus(data.message)
          }
        
        }
      } catch (err) {
        setHasErrors(true)
        setLoading(false)
        setSubmitting(false)
        setStatus('אירעה שגיאה כלשהי')
      }

      /////////////////////////
    },
  })

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark mb-3'>
            <FormattedMessage id='AUTH.GENERAL.FORGOT_PASSWORD' />
          </h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-400 fw-bold fs-4'>
            <FormattedMessage id='AUTH.GENERAL.ENTER_YOUR_EMAIL_TO_RESET_YOUR_PASSWRD' />
          </div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
            מצטערים, נראה שזוהו כמה שגיאות, אנא נסה שוב.
            </div>
          </div>
        )}

        {hasErrors === false && formik.status && (
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>{formik.status}</div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>
            <FormattedMessage id='AUTH.GENERAL.CONTACTINFO' />
          </label>
          <input
            type='email'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('contanctInfo')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.contanctInfo && formik.errors.contanctInfo},
              {
                'is-valid': formik.touched.contanctInfo && !formik.errors.contanctInfo,
              }
            )}
          />
          {formik.touched.contanctInfo && formik.errors.contanctInfo && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.contanctInfo}</span>
              </div>
            </div>
          )}

          <label className='form-label fw-bolder text-gray-900 fs-6' style={{marginTop: '5px'}}>
            <FormattedMessage id='AUTH.GENERAL.USERNAME' />
          </label>
          <input
            type='text'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('userName')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {'is-invalid': formik.touched.userName && formik.errors.userName},
              {
                'is-valid': formik.touched.userName && !formik.errors.userName,
              }
            )}
          />
          {formik.touched.userName && formik.errors.userName && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.userName}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button
            type='submit'
            id='kt_password_reset_submit'
            className='btn btn-lg btn-primary fw-bolder me-4'
          >
            {loading ? (
              <span className='indicator-label'>please wait....</span>
            ) : (
              <span className='indicator-label'>
                <FormattedMessage id='AUTH.GENERAL.SUBMIT' />
              </span>
            )}
          </button>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-lg btn-light-primary fw-bolder'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              <FormattedMessage id='AUTH.GENERAL.CANCEL' />
            </button>
          </Link>{' '}
        </div>
        {/* end::Form group */}
      </form>
    </>
  )
}
