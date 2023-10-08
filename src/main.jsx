import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './components/Home'
import MeetHome from './components/MeetHome'
import MeetVideo from './components/MeetVideo'
import Main from './layout/Main'

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
      {
        path: "/meetvideo/:videoID",
        element: <MeetVideo></MeetVideo> ,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  	<div className="mx-auto">
      		<RouterProvider router={router} />    
	</div>
  </React.StrictMode>,
)
