const jwt = require("jsonwebtoken");
require("dotenv").config();
const Utility = require("../utils/utility");
const userModel = require("../models/User");
const shoperModel = require("../models/shoper");
const adminModel = require("../models/Admin");
const response = require("../utils/response");
const responseCode = require("../utils/responseCode");



const userAuth = async (req, res, next) => {
  try {
    if (req && req.user && req.user.guestMode) {
      next();
    } else if (req && req.headers.authorization) {
      const accessTokenFull = req.headers.authorization;
      let accessToken = "";
      if (accessTokenFull.startsWith("Bearer")) {
        accessToken = accessTokenFull.substr("Bearer".length + 1);
      } else {
        const parts = accessTokenFull.split(" ");
        accessToken = parts[1];
      }
      console.log("accessToken: ", accessToken);
      const decodeData = await Utility.jwtVerify(accessToken);
      console.log("decodeData: ", decodeData);
      if (!decodeData) throw "Invalid Token";
      const userData = await userModel
        .findOne({
           _id: decodeData._id,
           isDeleted: false,
            isBlocked: false,
         })
        .lean()
        .exec();
      if (userData) {
        req.user = userData;
        req.user.forResetPassword = decodeData.forResetPassword;
        req.user.userType = "storeOwner";
        next();
      } else {
        return response.sendFailResponse(
          req,
          res,
          responseCode.UN_AUTHORIZED,
          "Invalid Token"
        );
      }
    } else {
      return response.sendFailResponse(
        req,
        res,
        responseCode.UN_AUTHORIZED,
        "Invalid Token"
      );
    }
  } catch (error) {
    next(error);
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (req.admin && req.admin.guestMode) {
      next();
    } else if (req.headers.authorization) {
      let accessToken = req.headers.authorization;
      if (accessToken.startsWith("Bearer")) {
        accessToken = accessToken.substr("Bearer".length + 1);
      }
      const decodeData = await Utility.jwtVerify(accessToken);
      if (!decodeData) throw process.lang.INVALID_TOKEN;
      const adminData = await adminModel
        .findOne({ _id: decodeData._id })
        .lean()
        .exec();
      if (adminData) {
        req.admin = adminData;
        req.admin.forResetPassword = decodeData.forResetPassword;
        req.admin.adminType = "ADMIN";
        next();
      } else {
        return response.sendFailResponse(
          req,
          res,
          responseCode.UN_AUTHORIZED,
          "Invalid Token"
        );
      }
    } else {
      return response.sendFailResponse(
        req,
        res,
        responseCode.UN_AUTHORIZED,
        "Invalid Token"
      );
    }
  } catch (error) {
    next(error);
  }
};

const shoperAuth = async (req, res, next) => {
  try {
    if (req && req.user && req.user.guestMode) {
      next();
    } else if (req && req.headers.authorization) {
      const accessTokenFull = req.headers.authorization;
      let accessToken = "";
      if (accessTokenFull.startsWith("Bearer")) {
        accessToken = accessTokenFull.substr("Bearer".length + 1);
      } else {
        const parts = accessTokenFull.split(" ");
        accessToken = parts[1];
      }
      console.log("accessToken: ", accessToken);
      const decodeData = await Utility.jwtVerify(accessToken);
      console.log("decodeData: ", decodeData);
      if (!decodeData) throw "Invalid Token";
      const userData = await shoperModel
        .findOne({
           _id: decodeData._id,
            isBlocked: false,
         })
        .lean()
        .exec();
      console.log("userData: ", userData);
      if (userData) {
        req.user = userData;
        req.user.forResetPassword = decodeData.forResetPassword;
        req.user.userType = "shoper";
        next();
      } else {
        return response.sendFailResponse(
          req,
          res,
          responseCode.UN_AUTHORIZED,
          "Invalid Token"
        );
      }
    } else {
      return response.sendFailResponse(
        req,
        res,
        responseCode.UN_AUTHORIZED,
        "Invalid Token"
      );
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { userAuth, adminAuth, shoperAuth };
