
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  clearAllapplicationErrors, 
  resetApplicationSlice,
  deleteApplication, 
  fetchJobSeekerApplications, 
  fetchEmployerApplications
} from '../store/slices/applicationSlice.js';
import Spinner from './Spinner';

const MyApplications = () => {
  const { user, isAuth } = useSelector(state => state.user);
  const { loading, error, applications, message } = useSelector(state => state.applications);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllapplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchJobSeekerApplications()); // Re-fetch applications on mount
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id) => {
    dispatch(deleteApplication(id))
      .then(() => {
        dispatch(fetchJobSeekerApplications()); 
      })
      .catch((err) => {
        toast.error("Failed to delete application");
      });
  };


  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not applied for any job.
        </h1>
      ) : (
        <>
          <div className="account_components">
            <h3>My Application For Jobs</h3>
            <div className="applications_container">
              {applications.map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p className="sub-sec">
                      <span>Job Title: </span> {element.jobInfo.jobTitle}
                    </p>
                    <p className="sub-sec">
                      <span>Name</span> {element.employeeInfo.name}
                    </p>
                    <p className="sub-sec">
                      <span>Email</span> {element.employeeInfo.email}
                    </p>
                    <p className="sub-sec">
                      <span>Phone: </span> {element.employeeInfo.phone}
                    </p>
                    <p className="sub-sec">
                      <span>Address: </span> {element.employeeInfo.address}
                    </p>
                    <p className="sub-sec">
                      <span>Coverletter: </span>
                      <textarea
                        value={element.employeeInfo.coverLetter}
                        rows={5}
                        disabled
                        style={{color:'black'}}
                      ></textarea>
                    </p>
                    <div className="btn-wrapper">
                      <button
                        className="btn"
                        onClick={() => handleDeleteApplication(element._id)}
                      >
                        Delete Application
                      </button>
                      <Link
                        to={
                          element.employeeInfo &&
                          element.employeeInfo.resume.url
                        }
                        className="btn"
                        target="_blank"
                      >
                        View Resume
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyApplications;


