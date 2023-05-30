import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { AliveScope } from 'react-activation';
import router from './router';
import { useEffect } from 'react';
import { message } from 'antd';
function ToHome() {
  const navigateTo = useNavigate()
  useEffect(() => {
    message.error('你已登陆')
    navigateTo('/charts')
  }, [])
  return (
    <></>
  )
}
function ToLogin() {
  const navigateTo = useNavigate()
  useEffect(() => {
    message.error('你还没有登陆')
    navigateTo('/login')
  }, [])
  return (
    <></>
  )
}
function BeforeRouterEnter() {
  useEffect(()=>{
    
  },[])
  const outlet = useRoutes(router)
  const location = useLocation()
  const token = localStorage.getItem('admin-token')
  if (token && location.pathname === '/login') return <ToHome />
  if (!token && location.pathname !== '/login') return <ToLogin />
  
  return outlet
}
function App() {
  return (
    <AliveScope>
      {BeforeRouterEnter()}
    </AliveScope>
  );
}

export default App;
