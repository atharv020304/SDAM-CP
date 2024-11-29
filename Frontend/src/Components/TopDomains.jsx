import React from 'react'

const TopDomains = () => {
  const services = [
    {
      id: 1,
      service: "Software Development",
      description: "We develop software solutions for businesses and individuals.",
    },
    {
      id: 2,
      service: "Web Design",
      description: "Crafting visually appealing and user-friendly websites.",
    },
    {
      id: 3,
      service: "Digital Marketing",
      description: "Boosting your brand's online presence through strategic marketing.",
    },
    {
      id: 4,
      service: "Data Analytics",
      description: "Turning data into actionable insights for informed decision-making.",
    },
    {
      id: 5,
      service: "Mobile App Development",
      description: "Creating mobile applications that engage and retain users.",
    },
    {
      id: 6,
      service: "Cloud Computing",
      description: "Offering scalable cloud solutions for your business needs.",
    },
    {
      id: 7,
      service: "Cybersecurity",
      description: "Protecting your digital assets with comprehensive security solutions.",
    }
  ];
  

  return (
    <section className='services'>
      <h3>Top Domains</h3>
      <div className='grid'>
        {
          services.map(element=>{
            return(
              <div className='card' key={element.id}> 
              <h4>{element.service}</h4>
              <p>{element.description}</p>
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default TopDomains