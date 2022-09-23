import React, { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import { FormattedMessage } from 'react-intl';
const API_URL = process.env.REACT_APP_API_URL;


const initialValues = {
  password: '',
  NewPassword: '',
  ConfirmPassword: ''
}

const changePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required(),
  NewPassword: Yup.string().required(),
  ConfirmPassword: Yup.string().required()
})

export function ChangePassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail');
  console.log('dddd', JSON.parse(logged_user_detail))
  const getUser = JSON.parse(logged_user_detail);
  const formik = useFormik({
    initialValues,
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        setLoading(true);
        setStatus('');
        const response = await axios.post(API_URL + '/api/Inner/ChangePassword', { oldPassword: values.password, newPassword: values.NewPassword, confirmPassword: values.ConfirmPassword },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${getUser.access_token}`
            }
          }
        );
        if (response) {

          setHasErrors(false);
          setLoading(false);
          const { data } = response;
          console.log('dataaa', data)
          if (data.result) {
            setStatus('הסיסמאות עודכנו')
          } else {
            setStatus(data.message)
          }
        }
      }
      catch (err) {
        setHasErrors(true)
        setLoading(false)
        setSubmitting(false)
        setStatus('אירעה שגיאה כלשהי ');
      }

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
          <h1 className='text-dark mb-3'>
            <FormattedMessage id="AUTH.GENERAL.CHANGE_PASSWORD" />
          </h1>
          <div className='text-gray-400 fw-bold fs-4'>
            {/* Enter your email to reset your password. */}
          </div>
        </div>

        {hasErrors === true && (
          <div className='mb-lg-15 alert alert-danger'>
            <div className='alert-text font-weight-bold'>
              Sorry, looks like there are some errors detected, please try again.
            </div>
          </div>
        )}

        {hasErrors === false && formik.status && (
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>{formik.status}</div>
          </div>
        )}

        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>
            <FormattedMessage id="AUTH.GENERAL.PASSWORD" />
          </label>
          <input
            type='password'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control form-control-lg',
              { 'is-invalid': formik.touched.password && formik.errors.password },
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

          <label className='form-label fw-bolder text-gray-900 fs-6' style={{ marginTop: '5px' }}>
            <FormattedMessage id="AUTH.GENERAL.NEW_PASSWORD" />
          </label>
          <input
            type='text'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('NewPassword')}
            className={clsx(
              'form-control form-control-lg',
              { 'is-invalid': formik.touched.NewPassword && formik.errors.NewPassword },
              {
                'is-valid': formik.touched.NewPassword && !formik.errors.NewPassword,
              }
            )}
          />
          {formik.touched.NewPassword && formik.errors.NewPassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.NewPassword}</span>
              </div>
            </div>
          )}


          <label className='form-label fw-bolder text-gray-900 fs-6' style={{ marginTop: '5px' }}>
            <FormattedMessage id="AUTH.GENERAL.CONFIRM_PASSWORD" />
          </label>
          <input
            type='text'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('ConfirmPassword')}
            className={clsx(
              'form-control form-control-lg',
              { 'is-invalid': formik.touched.ConfirmPassword && formik.errors.ConfirmPassword },
              {
                'is-valid': formik.touched.ConfirmPassword && !formik.errors.ConfirmPassword,
              }
            )}
          />
          {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.ConfirmPassword}</span>
              </div>
            </div>
          )}
        </div>
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button
            type='submit'
            id='kt_password_reset_submit'
            className='btn btn-lg btn-primary fw-bolder me-4'
          >
            {loading ? (
              <span className='indicator-label'>please wait....</span>
            ) : <span className='indicator-label'>
              <FormattedMessage id="AUTH.GENERAL.SUBMIT" />
            </span>}
          </button>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-lg btn-light-primary fw-bolder'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              <FormattedMessage id="AUTH.GENERAL.CANCEL" />
            </button>
          </Link>{' '}
        </div>
      </form>
    </>
  )
}
