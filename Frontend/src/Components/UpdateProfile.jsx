import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { clearAllUpdateProfileErrors, updateProfile } from '../store/slices/updateProfileslice'
import {ToastContainer,toast} from "react-toastify"
import { getUser } from '../store/slices/userSlice'
import { Link } from 'react-router-dom';

const UpdateProfile = () => {
  
  const { user } = useSelector(state => state.user)
  const { loading,error,isUpdated } = useSelector(state => state.updateProfile)

  const dispatch = useDispatch()
  const navigateTo = useNavigate()

  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phone, setPhone] = useState(user && user.phone);
  const [address, setAddress] = useState(user && user.address);
  const [coverLetter, setCoverLetter] = useState(user && user.coverLetter);
  const [firstDomain,setFirstDomain] = useState(user && user.firstDomain)
  const [secondDomain,setSecondDomain] = useState(user && user.secondDomain)
  const [thirdDomain,setThirdDomain] = useState(user && user.thirdDomain)
  const [resume,setResume] = useState(null);
  const [resumePreview,setResumePreview] = useState(user && user.resume?.url);




  const handleUpdateProfile =()=>{
    const formData =  new FormData();
    formData.append("name",name);
    formData.append("email",email);
    formData.append("phone",phone);
    formData.append("address",address);
    if(user && user.role === "Employee"){
      formData.append("firstDomain",firstDomain);
      formData.append("secondDomain",secondDomain);
      formData.append("thirdDomain",thirdDomain);
      formData.append("coverLetter",coverLetter);
    }
    if(resume){
      formData.append("resume",resume);
    }
    dispatch(updateProfile(formData));
  };

  useEffect(()=>{


    if(error){
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if(isUpdated){
      toast.success("Profile updated successfully");
      dispatch(getUser());
      dispatch(clearAllUpdateProfileErrors());
    }
  },[dispatch,loading,error,isUpdated,user])

  const resumeHandler =(e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = ()=>{
      setResumePreview(reader.result);
      setResume(file)
    }
  }

  const domainArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  return (
    <div className="account_components">
      <h3>Update Profile</h3>
      <div>
        <label>Username:</label>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type='email'  value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
     

      <div>
        <label>Phone:</label>
        <input type='number'  value={phone} onChange={(e) => setPhone(e.target.value)} />

      </div>

      <div>
        <label>Address:</label>
        <input type='text'  value={address} onChange={(e) => setAddress(e.target.value)} />

      </div>

     {
        user && user.role === "Employee" && (
          <>
          <div>
            <label>My Domains:</label>
            <div style={{display: "flex", flexDirection:"column",gap:"15px"}}>
              <select value={firstDomain} onChange={(e)=> setFirstDomain(e.target.value)}>
              {
                domainArray.map((element,index)=>{
                  return(
                    <option value={element} key={index} >{element}</option>
                  )
                })
              }
              </select>
              
              <select value={secondDomain} onChange={(e)=> setSecondDomain(e.target.value)}>
              {
                domainArray.map((element,index)=>{
                  return(
                    <option value={element} key={index} >{element}</option>
                  )
                })
              }
              </select>
              <select value={thirdDomain} onChange={(e)=> setThirdDomain(e.target.value)}>
              {
                domainArray.map((element,index)=>{
                  return(
                    <option value={element} key={index} >{element}</option>
                  )
                })
              }
              </select>

            </div>
          </div>


          <div>
              <label >CoverLetter</label>
              <textarea value={coverLetter} onChange={(e)=> setCoverLetter(e.target.value)} rows={5}/>
          </div>

          <div>
            <label>Upload Resume</label>
              <input type="file" onChange={resumeHandler}/>
              {
                user && user.resume && (
                  <div>
                    <p>Current Resume:</p>
                    <Link to={user.resume && user.resume.url} target='_blank' className='view-resume'>View Resume</Link>
                  </div>
                )
              }
              </div>
          </>
        )}
        <div className='save_change_btn_wrapper'><button className='btn' onClick={handleUpdateProfile} disabled={loading}>Save</button></div>

    </div>
  )
}

export default UpdateProfile


