import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {FaSquareXTwitter,FaSquareInstagram,FaYoutube,FaLinkedin} from "react-icons/fa6"
const Footer = () => {
  const {isAuth} = useSelector(state=> state.user)
  return (
    <>
    <footer>
      <div>
        <img src="/image.png" alt="logo"/>
      </div>
      <div>
        <h4>Support</h4>
        <ul>
        <li>Pune ,Maharashtra, India</li>
        <li>ab@gmail.com</li>
        <li>9378451260</li>
        </ul>
      </div>

      <div>
        <h4> Links </h4>
        <ul>
          <li><Link to={"/"}>Home</Link></li>
          <li><Link to={"/jobs"}>Jobs</Link></li>
          {
            isAuth && (<li><Link to="/dashboard">Profile</Link></li>)
          }
        </ul>
      </div>

      <div>
        <h4>Follow Us</h4>
        <ul>
          <li><Link to={"https://www.linkedin.com/in/atharv-bapat-059241264/"}>
          <span><FaSquareXTwitter/></span>
          <span>Twitter</span>
          </Link></li>
          
          <li><Link to={"https://www.instagram.com/"}>
          <span><FaSquareInstagram/></span>
          <span>Instagram</span>
          </Link></li>
          
          <li><Link to={"https://www.linkedin.com/in/atharv-bapat-059241264/"}>
          <span><FaYoutube/></span>
          <span>YouTube</span>
          </Link></li>

          <li><Link to={"https://www.linkedin.com/in/atharv-bapat-059241264/"}>
          <span><FaLinkedin/></span>
          <span>LinkedIn</span>
          </Link></li>
        </ul>
      </div>
    </footer>

   <div className='copyright'>
      {/* &copy; CopyRight 2024. All Rights Reserved By Athrv_B */}
    </div>
  </>
   
  )
}

export default Footer