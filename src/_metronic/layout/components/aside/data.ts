const routes: any = [
  {
    title: ' ניהול משתמשים',
    route: '/user-management',
    role: ['Admin'],
  },
  {
    title: 'דיווח יומי',
    route: '/trains-daily-report',
    role: ['OccUser', 'Admin'],
  },
  {
    title: 'Driver DashBoard',
    route: '/driver-dashboard',
    role: ['Driver'],
  },
  {
    title: 'Cleaner DashBoard',
    route: '/cleaner-dashboard',
    role: ['Cleaner'],
  },
  {
    title: ' דיווח ניקיון יומי',
    route: '/trains-cleaning-report',
    role: ['CleaningManager', 'Admin'],
  },
  {
    title: 'דיווח פעילות יומי',
    route: '/conductor-dashboard',
    role: ['Conductor', 'Admin'],
  },
]
export const Routes = (role: any) => {
  return routes.filter((r: any) => r.role.includes(role))
}
