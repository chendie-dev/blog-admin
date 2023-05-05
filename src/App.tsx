import { useRoutes } from 'react-router-dom';
import { AliveScope } from 'react-activation';
import router from './router';
function App() {
  const oulet = useRoutes(router)
  return (
    <AliveScope>
      {/* <Admin/> */}
      {oulet}
    </AliveScope>
  );
}

export default App;
