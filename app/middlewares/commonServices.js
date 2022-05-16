const db = require("../models");
const Townships = db.townships;
const Plots = db.plots;
var _ = require('lodash');

checkDuplicateTownship = (req, res, next) => {
  // Email
  Townships.findOne({
    where: {
      township_name: req.body.township_name,
      state: req.body.state,
      city: req.body.city
    }
  }).then(township => {
    if (township) {
      res.status(400).send({
        status :0,
        data:[],
        message: "Failed! Township name is already in use with mention state and city!"
      });
      return;
    }else{
      next();
    }
  });
};

plotVerify = (req, res, next) =>{
  if(req.body.plotNumber){
    Plots.findOne({
      where: {
        plot_number :req.body.plotNumber
      }
    }).then(plot => {
      console.log("sadsad"+ plot)
      if(_.size(plot)){
        if(plot.status > 0){
          res.status(400).send({
            status :0,
            data :[],
            message: "Failed! This Plot has been Booked!"
          });
        }else{
          next();
        }
        return;
      }else if (_.isNull(plot)) {
        res.status(400).send({
          status :0,
          data :[],
          message: "Failed! This Plot is not registered in our DB."
        });
        return;
      }else{
        next();
      }
    });
  }else{
    res.status(400).send({
      status :0,
      data:[],
      message: "Plot number is missing."
    });
    return;
  }
};

checkDuplicatePlotWithTownship = (req, res, next) => {
  // Email
  Plots.findOne({
    where: {
      townshipId: req.body.townshipId,
      plot_number: req.body.plot_number
    }
  }).then(township => {
    if (township) {
      res.status(400).send({
        status :0,
        data :[],
        message: "Failed! This Plot is already in added with township!"
      });
      return;
    }else{
      next();
    }
  });
};

const commonServices = {
  checkDuplicateTownship: checkDuplicateTownship,
  checkDuplicatePlotWithTownship : checkDuplicatePlotWithTownship,
  plotVerify : plotVerify
};
module.exports = commonServices; 