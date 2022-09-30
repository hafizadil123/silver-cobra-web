const routes:any =[
    {
        title:"Dashboard",
        route:"/",
        role:['OccUser','Admin','Cleaner']
    },
    {
        title:"דיווח יומי",
        route:'/trains-daily-report',
        role:['OccUser','Admin']
    }, 
    {
        title:"Driver DashBoard",
        route:'/driver-dashboard',
        role:['Admin','Driver']
    }, 
    {
        title:" דיווח ניקיון יומי",
        route:"/trains-cleaning-report",
        role:['cleaningManager','Admin']
    },
    {
        title:"Conductor Dashboard",
        route:"/conductor-dashboard",
        role:['Conductor']
    }
]
export const Routes =(role:any) =>{
    return routes.filter((r:any) =>r.role.includes(role));
}
