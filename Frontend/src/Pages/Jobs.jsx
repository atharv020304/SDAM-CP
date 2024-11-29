import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllJobErrors, fetchJobs } from '../store/slices/jobSlice';
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [domain, setDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { jobs, loading, error } = useSelector(state => state.jobs);

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  };

  const handleDomainChange = (domain) => {
    setDomain(domain);
    setSelectedDomain(domain);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    dispatch(fetchJobs(city, domain, searchKeyword));
  }, [dispatch, error, city, domain]);

  const handleSearch = () => {
    dispatch(fetchJobs(city, domain, searchKeyword));
  };

  const cities = [
    "Pune", "Chiplun", "Mumbai", "Delhi", "Bangalore",
    "Chennai", "Hyderabad", "Kolkata", "Ahmedabad",
    "Jaipur", "Surat", "Lucknow"
  ];

  const domainArray = [
    "Software Development", "Data Science", "Computer Science",
    "Cybersecurity", "Machine Learning", "Artificial Intelligence",
    "Cloud Computing", "Blockchain Technology", "DevOps", "Web Development"
  ];

  return (
    <section className='jobs'>
      <div className="search-tab-wrapper">
        <input
          type='text'
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>Find Job</button>
        <FaSearch />
      </div>

      <div className='wrapper'>
        <div className="filter-bar">
          <div className="cities">
            <h2>Filter jobs by cities</h2>
            {
              cities.map((city, index) => (
                <div key={index}>
                  <input
                    type='radio'
                    id={city}
                    name="city"
                    value={city}
                    checked={selectedCity === city}
                    onChange={() => handleCityChange(city)}
                  />
                  <label htmlFor={city}>{city}</label>
                </div>
              ))
            }
          </div>

          <div className="cities">
            <h2>Filter jobs by domain</h2>
            {
              domainArray.map((domain, index) => (
                <div key={index}>
                  <input
                    type='radio'
                    id={domain}
                    name="domain"
                    value={domain}
                    checked={selectedDomain === domain}
                    onChange={() => handleDomainChange(domain)}
                  />
                  <label htmlFor={domain}>{domain}</label>
                </div>
              ))
            }
          </div>
        </div>

        <div className="container">
          <div className='mobile-filter'>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Filter by City</option>
              {
                cities.map((city, index) => (
                  <option value={city} key={index}>{city}</option>
                ))
              }
            </select>

            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
              <option value="">Filter by domain</option>
              {
                domainArray.map((domain, index) => (
                  <option value={domain} key={index}>{domain}</option>
                ))
              }
            </select>
          </div>

          <div className='jobs_container'>
            {
              jobs && jobs.map(element => (
                <div className="card" key={element._id}>
                  {element.hiringMultiple === "Yes" ? (
                    <p className='hiring-multiple'>Hiring Multiple Candidates</p>
                  ) : (
                    <p className='hiring'>Hiring</p>
                  )}
                  <p className='title'>{element.title}</p>
                  <p className='company'>{element.companyName}</p>
                  <p className='location'>{element.location}</p>
                  <p className='salary'><span>Salary:</span> Rs. {element.salary}</p>
                  <p className='posted'><span>Posted On : </span>{element.jobPostedOn.substring(0, 10)}</p>
                  <div className="btn-wrapper">
                    <Link className="btn" to={`/post/application/${element._id}`}>Apply Now</Link>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default Jobs;



