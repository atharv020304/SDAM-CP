
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearAllJobErrors, deleteJob, fetchJobs, resetJobSlice } from '../store/slices/jobSlice.js';
import Spinner from './Spinner';

const MyJobs = () => {
  const dispatch = useDispatch();

  // Fetch job data from the Redux store
  const { loading, error, jobs, message } = useSelector((state) => state.jobs);

  // Fetch jobs when the component mounts
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }

    dispatch(fetchJobs()); // Ensure this action is correctly defined to fetch data

    // Debugging log to see the jobs data after dispatch
    console.log('Fetching jobs...');
  }, [dispatch, error, message]);

  // Check for loading state and errors
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    console.log('Error:', error); // Debugging log
    return <div className="error-message">Error fetching jobs.</div>;
  }

  // If jobs are undefined or not an array, handle it gracefully
  if (!jobs || !Array.isArray(jobs)) {
    console.log('Jobs data is not an array or is undefined'); // Debugging log
    return <div className="error-message">No jobs available or invalid data format.</div>;
  }

  // Render the list of jobs
  return (
    <div className="jobs-section">
      <h2 className="jobs-header">My Jobs</h2>
      <div className="jobs-container">
        {jobs.length === 0 ? (
          <h1 className="no-jobs-message">You have not posted any job!</h1>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <p className="job-detail"><span>Job Title: </span>{job.title}</p>
              <p className="job-detail"><span>Job Domain: </span>{job.jobDomain}</p>
              <p className="job-detail"><span>Salary: </span>{job.salary}</p>
              <p className="job-detail"><span>Location: </span>{job.location}</p>
              <p className="job-detail"><span>Job Type: </span>{job.jobType}</p>
              <p className="job-detail"><span>Company Name: </span>{job.companyName}</p>
              <p className="job-detail"><span>Introduction: </span>{job.introduction}</p>
              <p className="job-detail"><span>Qualifications: </span>{job.qualification}</p>
              <p className="job-detail"><span>Responsibilities: </span>{job.responsibilities}</p>
              {job.offers && <p className="job-detail"><span>What Are We Offering: </span>{job.offers}</p>}
              <div className="button-wrapper">
                <button className="delete-job-button" onClick={() => dispatch(deleteJob(job._id))}>
                  Delete Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;
