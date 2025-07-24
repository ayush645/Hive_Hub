const OTP = require("../models/otp"); // Importing otp.js file
const sendmail = require("./mail"); // Importing mail.js file
const bcrypt = require("bcrypt"); // Importing bcrypt module
 
const responseCode = require("./responseCode"); // Importing responseCode.js file
require("dotenv").config(); // Load environment variables from .env file
const twilio = require("twilio");
const moment = require("moment");
const smsService = require("../v1/services/smsService");
const Utility = require("./utility");
const { otp } = require("../v1/services");
const { cache } = require("joi");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken, {
    lazyLoading: true,
  });



//=========================================== Generate Otp ========================================================

const generateOtp = ()=> {
    const  otp = Math.floor((Math.random() * 9000 + 50));
    return otp;
}
//=============================================== SendOtp To Mail =====================================================

const sendOtpToEmail  = async (email) => {
    
    try{
    //generating ramdom 4 number otp for verification code.
    // const Otp = generateOtp();
    //  console.log("Otp ================: ",Otp);
    let staticOtp = 1234;

    // delete old opt from database.
    await OTP.deleteMany({ email : email});

    let data = {
        email: email,
        otp : staticOtp,
        expiredAt: moment().add(10, "minutes").toDate(),
    }

    await sendmail.sendEmail(email,staticOtp);
    
    // store otp in the database 
    
    let otp = await OTP.create(data);
    console.log("otp=====:",otp);

    // send the otp to the user via mail.
    return otp ;
} catch (error) {
    return  error;
}

}; 



//==================================== SendOtp to Phone ===============================================

async function sendOtpTOPhone (
    countryCode,
    phone,
    user,
    otpCode = "1234",
    expiredAt = moment().add(10, "minutes").toDate()
){
    // clear old send otp message
    await OTP.deleteMany({
        phone: phone,
        countryCode: countryCode,
      });

      let data = {
        phone:phone ,
        countryCode:countryCode,
        otp :otpCode,
        expiredAt:expiredAt
      };

      if(user) {
        data.userId = user._id;
    }

    await smsService.sendSMSTwillo(
        countryCode,
        phone,
        `Your verification code is ${otpCode}`
    );

    let otp = await OTP.create(data);
    return otp;
};

//================================================= VerifyOtp ==============================================

const verifyOtp = async (countryCode, data, otp) => {

    let email, mobileNumber ;

    if(Utility.isEmail(data)) {
        email = data;
    }
    else {
        mobileNumber = data;
    }
    
    try{
        // find the otp or match the otp from database 
        const storedOTP = await OTP.findOne({
            $or: [
                {email, otp},
                {countryCode, mobileNumber, otp},
            ],
        });
         
        if(storedOTP){
            // delete the otp from the database 
            await OTP.deleteOne({
                $or: [
                    {email, otp},
                    {countryCode, mobileNumber, otp},
                ],
            });
            return true;
        }
        else {
            return false;
        }

    } catch (error) {
        throw new Error(`Error in verifying otp :  ${error}`);
    }

};


// Secure Password
const securePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt, hashedPassword);
  } catch (error) {
    console.log("error: ", error);
  }
};

const isEmailVerify = async (email, otp) => {
    try {
        sendOtpToEmail(email, otp);
        verifyOtp(email, otp);
        res.status(responseCode.OK).json({message: process.lang.EMAIL_VERIFIED})
    } catch (error) {
        console.log("error: ", error);
    res
      .status(responseCode.INTERNAL_SERVER_ERROR)
      .json({ message: process.lang.EMAIL_NOT_VERIFIED });
    }
};

async function convertMap(obj) {
    return Array.from(obj).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: value }),
      {}
    );
  }


  //===================================== SEND Ticket To Mail =======================================
  const sendTicketToEmail  = async (email) => {
    
    try{
     
    let staticOtp = 1234;

    // delete old opt from database.
    await OTP.deleteMany({ email : email});

    let data = {
        email: email,
        otp : staticOtp,
        expiredAt: moment().add(10, "minutes").toDate(),
    }

    await sendmail.sendTicket(email,staticOtp);
    
    // store otp in the database 
    
    let otp = await OTP.create(data);
    console.log("otp=====:",otp);

    // send the otp to the user via mail.
    return otp ;
} catch (error) {
    return  error;
}

};

module.exports = {
    generateOtp,
    sendOtpToEmail,
    sendOtpTOPhone,
    verifyOtp,
    securePassword,
    isEmailVerify,
    convertMap,
}












