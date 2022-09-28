const routes:any =[
  
    {
        title:"Dashboard",
        route:"/",
        role:['OccUser','admin','Cleaner']
    },
    {
        title:"דיווח יומי",
        route:'/trains-daily-report',
        role:['OccUser','admin']
    }, 
    {
        title:" דיווח ניקיון יומי",
        route:"/trains-cleaning-report",
        role:['Cleaner','admin']
    }
]
export const Routes =(role:any) =>{
    return routes.filter((r:any) =>r.role.includes(role));
}
