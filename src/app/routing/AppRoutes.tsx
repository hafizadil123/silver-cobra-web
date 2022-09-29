/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import {FC} from 'react'
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {PrivateRoutes} from './PrivateRoutes'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {Logout, AuthPage} from '../modules/auth'
import {RootState} from '../../setup'
import {App} from '../App';


// import {Tables} from './../modules/widgets/components/Tables'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */


const AppRoutes: FC = () => {
  const isAuthorized =localStorage.getItem('logged_user_detail')
  // setLanguage('he')
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* <Route path="/test-tables" element={<Tables/>} /> */}
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {isAuthorized ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              <Route index element={<Navigate to='/driver-dashboard' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
       
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {AppRoutes}
