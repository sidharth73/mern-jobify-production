// import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './Pages/Register';
import Landing from "./Pages/Landing";
import { AllJobs,Profile,SharedLayout,Stats,AddJob } from "./Pages/dashboard/index.js";
import ProtectedRoutes from "./Pages/ProtectedRoutes";
import Error from "./Pages/Error";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <ProtectedRoutes>
            <SharedLayout />
          </ProtectedRoutes>
        }>
          <Route index element={<Stats />} />
          <Route path='all-jobs' element={<AllJobs />} />
          <Route path='add-job' element={<AddJob />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/landing' element={<Landing/>} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
