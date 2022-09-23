/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState, useEffect } from 'react'
import clsx from 'clsx'
import { shallowEqual, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { UserModel } from '../../../../app/modules/auth/models/UserModel'
import { RootState } from '../../../../setup'
import axios from 'axios';
import { Languages } from './Languages'
import * as auth from '../../../../app/modules/auth/redux/AuthRedux'
import { useDispatch } from 'react-redux'
import { toAbsoluteUrl } from '../../../helpers'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'svg-icon-1'

const HeaderUserMenu: FC = () => {
  const [user, setUser] = useState<any>({});
  const API_URL = process.env.REACT_APP_API_URL;

  const getUserDetailUrl = `${API_URL}/api/Inner/GetLoggedInUser`;
  const logged_user_detail: any = localStorage.getItem('logged_user_detail');
  const getUser = JSON.parse(logged_user_detail);
  useEffect(() => {
    async function fetchMyAPI() {
      const response = await axios.post(getUserDetailUrl, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${getUser.access_token}`
        }
      });
      localStorage.setItem('userType', response.data.userType);
      localStorage.setItem('logged_in_user_firstName',response?.data?.firstName);
      setUser(response.data)
    }

    fetchMyAPI()
   
  }, []);
  const dispatch = useDispatch()
  const logout = () => {
    localStorage.removeItem('logged_user_detail')
    dispatch(auth.actions.logout())
    window.location.href = '/auth';
  }
  console.log(user)
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('/media/avatars/blank.png')} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
             {user.firstName} {user.lastName}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {user.email}
             </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>


    

      

      <div className='menu-item px-5'>
        {/* <Link to='/profile/change-password' className='menu-link px-5'>
          Change Password
        </Link> */}
      </div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
