import { useRoutes } from 'react-router-dom';
import router from './router';
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
