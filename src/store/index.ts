import {
  configureStore
} from '@reduxjs/toolkit'
import menuItemReducer from './menuItemSlice'
import reqDataReducer from './reqDataSlice'
const store = configureStore({
  reducer: {
    menuItems: menuItemReducer,
    reqData:reqDataReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch