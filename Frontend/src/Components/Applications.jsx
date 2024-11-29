
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  clearAllapplicationErrors,
  deleteApplication,
  fetchEmployerApplications,
  fetchJobSeekerApplications,
  resetApplicationSlice,
} from '../store/slices/applicationSlice';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';

const Applications = () => {
  const { applications, loading, error, message } = useSelector(state => state.applications);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Applications:', applications); // Debugging: Check the applications data
    if (error) {
      toast.error(error);
      dispatch(clearAllapplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchEmployerApplications());
  }, [dispatch, error, message]);

  const handleDeleteApplication = (id) => {
    dispatch(deleteApplication(id));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        applications && applications.length === 0 ? (
          <h1>No Applications Available</h1>
        ) : (
          <div className="account_components">
            <h3>Applications For Your Posted Jobs</h3>
            <div className="applications_container">
              {applications.map((element) => (
                <div className="card" key={element._id}>
                  <p className="sub-sec">
                    <span>Job Title: </span> {element.jobInfo.jobTitle}
                  </p>
                  <p className="sub-sec">
                    <span>Applicant's Name:</span> {element.employeeInfo.name}
                  </p>
                  <p className="sub-sec">
                    <span>Applicant's Email:</span> {element.employeeInfo.email}
                  </p>
                  <p className="sub-sec">
                    <span>Applicant's Phone: </span> {element.employeeInfo.phone}
                  </p>
                  <p className="sub-sec">
                    <span>Applicant's Address: </span> {element.employeeInfo.address}
                  </p>
                  <p className="sub-sec">
                    <span>Applicant's Cover Letter: </span>
                    <textarea
                      value={element.employeeInfo.coverLetter}
                      rows={5}
                      disabled
                    />
                  </p>
                  <div className="btn-wrapper">
                    <button
                      className="btn"
                      onClick={() => handleDeleteApplication(element._id)}
                    >
                      Delete Application
                    </button>
                    <Link
                      to={element.employeeInfo.resume.url}
                      className="btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Applications;
