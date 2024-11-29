
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearAllapplicationErrors, postApplication, resetApplicationSlice } from '../store/slices/applicationSlice';
import { toast } from 'react-toastify';
import { fetchSingleJob } from '../store/slices/jobSlice';

const PostApplication = () => {
  const { singleJob } = useSelector(state => state.jobs);
  const { isAuth, user } = useSelector(state => state.user);
  const { loading, error, message } = useSelector(state => state.applications);
  const { jobId } = useParams();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handlePostApplication = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);

   

   
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    dispatch(postApplication(formData, jobId));
  };

  useEffect(() => {
    if(user){
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "")
      setResume((user.resume && user.resume.url) || "")
    }
    if (error) {
      toast.error(error);
      dispatch(clearAllapplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
   
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, error, message, jobId,user]);


  const qualifications = singleJob?.qualification?.split(". ") || [];
  const responsibilities = singleJob?.responsibilities?.split(". ") || [];
  const offering = singleJob?.offers?.split(". ") || [];

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    console.log("Selected file: ", file); 
    setResume(file);
  };

  return (
    
    <article className="application_page">
      
        <form>
        <h3>Application Form</h3>
        <div>
          <label>Job Title</label>
          <input type="text" placeholder={singleJob.title || ''} readOnly />
        </div>
        <div>
          <label>Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Your Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        {isAuth && user.role === "Employee" && (
          <>
            <div>
              <label>Coverletter</label>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={10} />
            </div>
            <div>
              <label>Resume</label>
              <input type="file" onChange={resumeHandler} accept=".pdf,.doc,.docx" />
            </div>
          </>
        )}

        {isAuth && user.role === "Employee" && (
          <div style={{ alignItems: "flex-end" }}>
            <button className="btn" onClick={handlePostApplication} disabled={loading}>
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>
        )}
      </form>
    
      <div className="job-details">
        <header>
          <h3>{singleJob?.title}</h3>
          {singleJob?.personalWebsite && (
            <a href={singleJob?.personalWebsite.url} target="_blank" rel="noopener noreferrer">
              {singleJob?.personalWebsite.title}
            </a>
          )}
          <p>{singleJob?.location}</p>
          <p>Rs. {singleJob?.salary} a month</p>
        </header>
        <hr />
        <section>
          <div className="wrapper">
            <h3>Job details</h3>
            <div>
              <span>Pay</span>
              <span>{singleJob?.salary} a month</span>
            </div>
            <div>
              <span>Job type</span>
              <span>{singleJob?.jobType}</span>
            </div>
          </div>
          <hr />
          <div className="wrapper">
            <h3>Location</h3>
            <div className="location-wrapper">
              <span>{singleJob?.location}</span>
            </div>
          </div>
          <hr />
          <div className="wrapper">
            <h3>Full Job Description</h3>
            <p>{singleJob?.introduction}</p>
            {singleJob?.qualifications && (
              <div>
                <h4>Qualifications</h4>
                <ul>
                  {qualifications.map((element) => (
                    <li key={element} style={{ listStyle: "inside" }}>{element}</li>
                  ))}
                </ul>
              </div>
            )}
            {singleJob?.responsibilities && (
              <div>
                <h4>Responsibilities</h4>
                <ul>
                  {responsibilities.map((element) => (
                    <li key={element} style={{ listStyle: "inside" }}>{element}</li>
                  ))}
                </ul>
              </div>
            )}
            {singleJob?.offers && (
              <div>
                <h4>Offering</h4>
                <ul>
                  {offering.map((element) => (
                    <li key={element} style={{ listStyle: "inside" }}>{element}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
        <hr />
        <footer>
          <h3>Job Niche</h3>
          <p>{singleJob?.jobDomain}</p>
        </footer>
      </div>
    </article>
  );
};

export default PostApplication;
