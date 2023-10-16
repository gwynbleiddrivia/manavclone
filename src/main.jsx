import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './components/Home'
import MeetHome from './components/MeetHome'
import Main from './layout/Main'


import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './store/reducer';



import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/meethome",
        element: <MeetHome></MeetHome> ,
      },
    ]
  },
]);

const store = createStore(reducer)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  	<Provider store={store}>
  	<div className="mx-auto">
      		<RouterProvider router={router} />    
	</div>
	</Provider>
  </React.StrictMode>,
)
