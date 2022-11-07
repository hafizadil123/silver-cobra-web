const routes: any = [
  {
    title: 'דיווח פעילות יומי',
    route: '/conductor-dashboard',
    role: ['Conductor', 'Admin'],
  },

  {
    title: 'דיווח יומי',
    route: '/trains-daily-report',
    role: ['OccUser', 'Admin'],
  },

  {
    title: ' דיווח ניקיון יומי',
    route: '/trains-cleaning-report',
    role: ['CleaningManager', 'Admin'],
  },
  {
    title: ' ניהול משתמשים',
    route: '/user-management',
    role: ['Admin'],
  },
  {
    title: 'ביקורת רכבות',
    route: '/driver-dashboard',
    role: ['Driver'],
  },
  {
    title: 'ביקורת רכבות',
    route: '/cleaner-dashboard',
    role: ['Cleaner'],
  },
  {
    title: 'ניהול רשימת בדיקות יומיות',
    route: '/manage-daily-attendance-check-types',
    role: ['Admin'],
  },
]
export const Routes = (role: any) => {
  return routes.filter((r: any) => r.role.includes(role))
}
