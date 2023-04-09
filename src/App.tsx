import { useRoutes } from 'react-router-dom';
import router from './router';
import Admin from './Admin'
function App() {
  const oulet=useRoutes(router)
  return (
    <>
    {/* <Admin/> */}
    {oulet}
    </>
  );
}

export default App;
