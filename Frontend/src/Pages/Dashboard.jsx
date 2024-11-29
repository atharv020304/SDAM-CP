import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearAllUserErrors, logoutUser } from '../store/slices/userSlice';
import { LuMoveRight } from 'react-icons/lu'; 
import MyProfile from '../Components/MyProfile';
import MyJobs from "../Components/MyJobs";
import UpdatePassword from '../Components/UpdatePassword';
import UpdateProfile from '../Components/UpdateProfile';
import JobPost from '../Components/JobPost';
import MyApplications from '../Components/MyApplications';
import Applications from '../Components/Applications';



const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [componentName, setComponentName] = useState("");

  const { loading, isAuth, error, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully.");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuth) {
      navigateTo("/");
    }
  }, [dispatch, error, loading, isAuth]);

  

  return (
    <>
      <section className="account">
        <div className="component_header">
          <p>Dashboard</p>
          <p>Welcome! <span>{user.name}</span></p>
        </div>
        <div className="container">
          <div className={show ? "sidebar showSidebar" : "sidebar"}>
            <ul className="sidebar_links">
              <h4>Manage Account</h4>
              <li>
                <button
                  onClick={() => {
                    setComponentName("My Profile");
                    setShow(!show);
                  }}
                >
                  My Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setComponentName("Update Profile");
                    setShow(!show);
                  }}
                >
                  Update Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setComponentName("Update Password");
                    setShow(!show);
                  }}
                >
                  Update Password
                </button>
              </li>

              {user && user.role === "Employer" && (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setComponentName("Job Post");
                        setShow(!show);
                      }}
                    >
                      Post New Job
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setComponentName("My Jobs");
                        setShow(!show);
                      }}
                    >
                      My Jobs
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setComponentName("Applications");
                        setShow(!show);
                      }}
                    >
                      Applications
                    </button>
                  </li>
                </>
              )}

              {user && user.role === "Employee" && (
                <li>
                  <button
                    onClick={() => {
                      setComponentName("My Applications");
                      setShow(!show);
                    }}
                  >
                    My Applications
                  </button>
                </li>
              )}
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
          <div className="banner">
            <div className={show ? "sidebar_icon move_right" : "sidebar_icon move_left"}>
              <LuMoveRight
                onClick={() => setShow(!show)}
                className={show ? "left_arrow" : "right_arrow"}
              />
            </div>
            {(() => {
              switch (componentName) {
                case "My Profile":
                  return <MyProfile />;
                case "Update Profile":
                  return <UpdateProfile />;
                case "Update Password":
                  return <UpdatePassword />;
                case "Job Post":
                  return <JobPost />;
                case "My Jobs":
                  return <MyJobs />;
                case "Applications":
                  return <Applications />;
                case "My Applications":
                  return <MyApplications />;
                default:
                  return <MyProfile />;
              }
            })()}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
