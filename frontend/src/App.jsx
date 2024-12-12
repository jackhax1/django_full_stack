import { React, useState, useEffect, createContext, useContext, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import LoadingPage from "./pages/LoadingPage";

import APIKeys from "./pages/APIKeys";
import Sales from "./pages/Sales";
import Statistic from "./pages/Statistic";
import Settings from "./pages/Settings";
import DeviceDetail from "./pages/DeviceDetailPage";
import Registration from "./pages/RegisterPage";

import BasePage from "./components/BasePage";

import { getCSRF } from "./utils/utils";
import dayjs from 'dayjs';


export const UserContext = createContext();
export const SalesContext = createContext();
export const StatContext = createContext();



export default function App() {

  const [state, setState] = useState({
    csrf: "",
    username: "",
    password: "",
    error: "",
    isAuthenticated: false,
  })

  const [isLoading, setIsLoading] = useState(true);

  const [homeinfo, setHomeInfo] = useState({
    'total_sales_ytd': { title: 'Revenue Year-to-Date', content: '0' },
    'total_sales_mtd': { title: 'Revenue Month-to-Date', content: '0' },
    'total_sales_today': { title: 'Revenue Today', content: '0' },
    'number_of_products': { title: 'Products Sold Today', content: '0' },
    'top_5_qty': [],
    'top_5_revenue': [],
    'daily_sales_info': {},
    'selected_date': dayjs(),
  });



  const [statData, setStatData] = useState();


  function getSession() {
    fetch("/backend/session/", {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setState(prevState => ({ ...prevState, isAuthenticated: true, username: data["username"] }));
        } else {
          setState(prevState => ({ ...prevState, isAuthenticated: false }));
          getCSRF(setState);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function transformData(inputData) {

    var outputData = []

    outputData['total_sales_ytd'] = { title: 'Revenue Year-to-Date', content: 'RM ' + inputData['total_sales_ytd'].toLocaleString() }
    outputData['total_sales_mtd'] = { title: 'Revenue Month-to-Date', content: 'RM ' + inputData['total_sales_mtd'].toLocaleString() }
    outputData['total_sales_today'] = { title: 'Revenue Today', content: 'RM ' + inputData['total_sales_today'].toLocaleString() }
    outputData['number_of_products'] = { title: 'Products Sold Today', content: inputData['number_of_products'] }

    outputData['top_5_qty'] = inputData['top_5_qty'].map((value, index) => {
      return {
        key: index,
        product_id: value['product_id'],
        name: value['name'],
        total_quantity: Math.floor(value['total_quantity']).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
    })

    outputData['top_5_revenue'] = inputData['top_5_revenue'].map((value, index) => {
      return {
        key: index,
        product_id: value['product_id'],
        name: value['name'],
        total_revenue: "RM " + parseFloat(value['total_revenue']).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }
    })

    outputData['daily_sales_info'] = structuredClone(homeinfo['daily_sales_info'])
    outputData['selected_date'] = homeinfo['selected_date']

    outputData['fetched'] = true;

    setHomeInfo(outputData)
  }



  useEffect(() => {
    if (state.isAuthenticated) {
      fetch("/backend/homeinfo", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      })
        .then((res) => res.json())
        .then((data) => {

          transformData(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [state])

  useEffect(() => {
    if (state.isAuthenticated) {
      fetch("/backend/stat_by_date", {
        headers: {
          "Content-Type": "application/json",
          "X-Date":homeinfo['selected_date'],
        },
        credentials: "same-origin",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('haha')
          console.log(data)
            homeinfo['daily_sales_info'] = data['daily_sales_info']
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [homeinfo.selected_date,state])

  useEffect(() => {
    getSession(state, setState, isLoading, setIsLoading);
  },
    [])

  useEffect(() => {
    if (state.isAuthenticated) {
      fetch("/backend/get_statistics", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      })
        .then((res) => res.json())
        .then((data) => {
          data['fetched'] = true
          setStatData(data)
          console.timeLog(data)
        })
        .catch((err) => {
          console.error(err);
        });
    }

  }, [state])



  if (isLoading) {
    return (<LoadingPage />)
  }

  return (
    <UserContext.Provider value={[state, setState, isLoading, setIsLoading]}>
      <SalesContext.Provider value={[homeinfo, setHomeInfo]}>
        <StatContext.Provider value={[statData, setStatData]}>
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route element={<AuthRoutes state={state} />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Registration />} />
              </Route>
              <Route element={<ProtectedRoutes state={state} />}>
                <Route path="/" element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="sales" element={<Sales />} />
                <Route path="sales/:deviceId" element={<DeviceDetail />} />
                <Route path="statistic" element={<Statistic />} />
                <Route path="api-keys" element={<APIKeys />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Suspense>
        </StatContext.Provider>
      </SalesContext.Provider>
    </UserContext.Provider>
  )
}

const AuthRoutes = ({ state }) => {
  return state.isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

const ProtectedRoutes = ({ state }) => {
  return state.isAuthenticated ? <BasePage /> : <Navigate to="/login" />;
};




