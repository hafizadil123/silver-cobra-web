

export const matchConsumerId=(consumerId:any,dispatch:any,auth:any)=>{
  const queryParams = new URLSearchParams(window.location.search);
    const urlConsumerId = queryParams.get('consumerId');
    if (consumerId !== urlConsumerId) {
      dispatch(auth.actions.logout());
    }
}