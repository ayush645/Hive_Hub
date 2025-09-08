import React from 'react'
import Navbar from './_components/Navbar'
import Landing from './_components/Landing'
import WhyUsSection from './_components/WhyUs'
import DesignProcess from './_components/Process'
import BenefitsCarousel from './_components/WhoisFor'
import StatsSection from './_components/Stats'
import Testimonial from './_components/testimonials'
import Footer from './_components/Footer'


const Page = () => {
  return (
    <div>
        <Navbar />
      <Landing />
      <WhyUsSection />
      <DesignProcess />
      <BenefitsCarousel />
      <StatsSection />
      <Testimonial />
      <Footer />
    </div>
  )
}

export default Page