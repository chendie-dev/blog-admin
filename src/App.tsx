import { useRoutes } from 'react-router-dom';
import { AliveScope } from 'react-activation';
import router from './router';
import MenuItemsProvider from './components/MenuItemsProvider';
function App() {
  const oulet = useRoutes(router)
  return (
    <AliveScope>
      {/* <MenuItemsProvider> */}
          {oulet}
      {/* </MenuItemsProvider> */}
    </AliveScope>
  );
}

export default App;
