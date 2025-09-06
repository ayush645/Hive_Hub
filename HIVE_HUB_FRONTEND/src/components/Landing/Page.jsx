import React from 'react'
import Navbar from '../../../../../hivehub/src/components/Navbar'
import Landing from '../../../../../hivehub/src/components/Landing'
import WhyUsSection from '../../../../../hivehub/src/components/WhyUs'
import DesignProcess from '../../../../../hivehub/src/components/Process'
import BenefitsCarousel from '../../../../../hivehub/src/components/WhoisFor'
import StatsSection from '../../../../../hivehub/src/components/Stats'
import Testimonial from '../../../../../hivehub/src/components/testimonials'
import Footer from '../../../../../hivehub/src/components/Footer'

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