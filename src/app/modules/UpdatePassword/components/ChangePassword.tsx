import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import axios from 'axios'
import {FormattedMessage} from 'react-intl'
import {useToasts} from 'react-toast-notifications'
import {useNavigate} from 'react-router-dom'
const API_URL = process.env.REACT_APP_API_URL

const initialValues = {
  oldPassword: '',
  NewPassword: '',
  ConfirmPassword: '',
}

const updatePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required(),
  NewPassword: Yup.string().required(),
  ConfirmPassword: Yup.string().required(),
})

export function UpdatePassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const getUser = JSON.parse(logged_user_detail)
  const {addToast} = useToasts()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues,
    validationSchema: updatePasswordSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      try {
        setLoading(true)
        setStatus('')
        const response = await axios.post(
          API_URL + '/api/account/ChangePassword',
          {
            oldPassword: values.oldPassword,
            newPassword: values.NewPassword,
            confirmPassword: values.ConfirmPassword,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${getUser.access_token}`,
            },
          }
        )
        if (response.status === 200) {
          setHasErrors(false)
          setLoading(false)
          setStatus()
          addToast('סיסמא עודכנה בהצחלה', {appearance: 'success', autoDismiss: true})
          setTimeout(() => {
            navigate('/')
          }, 2000)
        }
      } catch (err: any) {
        setHasErrors(true)
        setLoading(false)
        setSubmitting(false)
        addToast(JSON.stringify(err.ModelState), {appearance: 'error', autoDismiss: true})
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
          <h1 className='text-dark mb-3'>החלף סיסמא</h1>
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

        <div className='fv-row mb-10'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>סיסמא נוכחית</label>
          <input
            type='password'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('oldPassword')}
            className={clsx(
              'form-control form-control-lg',
              {'is-invalid': formik.touched.oldPassword && formik.errors.oldPassword},
              {
                'is-valid': formik.touched.oldPassword && !formik.errors.oldPassword,
              }
            )}
          />
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.oldPassword}</span>
              </div>
            </div>
          )}

          <label className='form-label fw-bolder text-gray-900 fs-6' style={{marginTop: '5px'}}>
            סיסמא חדשה
          </label>
          <input
            type='password'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('NewPassword')}
            className={clsx(
              'form-control form-control-lg',
              {'is-invalid': formik.touched.NewPassword && formik.errors.NewPassword},
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

          <label className='form-label fw-bolder text-gray-900 fs-6' style={{marginTop: '5px'}}>
            אישור סיסמא
          </label>
          <input
            type='password'
            placeholder=''
            autoComplete='off'
            {...formik.getFieldProps('ConfirmPassword')}
            className={clsx(
              'form-control form-control-lg',
              {'is-invalid': formik.touched.ConfirmPassword && formik.errors.ConfirmPassword},
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
            ) : (
              <span className='indicator-label'>
                <FormattedMessage id='AUTH.GENERAL.SUBMIT' />
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
