import {
  configureStore
} from '@reduxjs/toolkit'
import menuItemReducer from './menuItemSlice'
const store = configureStore({
  reducer: {
    menuItems: menuItemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch