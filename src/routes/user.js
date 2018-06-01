/***********************
 * Module dependencies *
 ***********************/

const utils = require('../../util/util');
const config = require('../../config');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

/************************************************
 *      POST RESQUEST FOR REGISTRATION          *
 ***********************************************/

module.exports.register = (req, res) => {
    let {firstName, lastName, email, password} = req.body;
    if (!utils.noEmptyParams(req.body)) res.json({success: false, message: config.messages.NO_DATA});
    else {

        const user = new User({
            firstName,
            lastName,
            email,
            password
            
        });

        User.isEmailUnique(email)
            .then(
                () => user.save(),
                () => {
                    res.json({success: false, message: config.messages.EMAIL_NOT_UNIQUE})
                }
            )
            .then((user) => {
                //email notification is sent the moment you register on the app
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'churchsapps@gmail.com',
                        pass: 'pass_w0rd'
                }
                });
    
                var mailOptions = {
                  from: 'churchsapps@gmail.com',
                    to: user.email,
                    subject: 'Welcome to X-farms',
                    text: `Hello ${firstName} ${lastName},
                    
                    Welcome to X-farms, enjoy all our products and services.

                    ${req.headers.host}
            
                    Thanks for choosing us!
                    X-farms.
                    `
                };
    
                transporter.sendMail(mailOptions, (error, info)=>{
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Email sent:  ${info.response}`);
                    }
                }); 
    
                res.json({success: `Welcome ${firstName} ${lastName}, you're now registered!`});
            })
            .catch(error => {
                res.json({success: false})
            });
        }

};



/**********************************
 *      POST RESQUEST FOR LOGIN   *
 *********************************/
module.exports.login = (req, res) => {
    let {email, password} = req.body;

    if (!utils.noEmptyParams(req.body)) res.json({success: false, message: config.messages.NO_DATA});
    else
        User.findOne({email:email})
            .exec()
            .then(user => {
                if (user) {
                    user = JSON.parse(JSON.stringify(user));
                    jwt.sign(user, config.jwt.secret, config.jwt.options, (err, token) => {
                        res.json({
                            success: "You're now login",
                            user,
                            token,
                        });
                    });
                } else {
                    res.json({success: false, message: config.messages.INVALID_CREDENTIALS});
                }

        })
            .catch(error => {
                if(error);
                res.json({success: false});
            });
};



/********************************
*    FORGOT PASSWORD            *  
* ******************************/
    module.exports.forgot_pword = (req, res) => {
    let {email, password} = req.body;
    async.waterfall([
      (done)=> {
            User.findOne({
              email: email
            }).exec(function(err, user) {
              if (user) {
                done(err, user);
              } else {
                done('User not found.');
              }
            });
          },
          (user, done) =>{
          // create the random token
        crypto.randomBytes(20, (err, buf)=> {
          var token = buf.toString('hex');
          done(err, user, token);
        });
      },
      (user, token, done)=> {
        User.findByIdAndUpdate({ _id: user._id }, {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000}, // 1 hour
            { upsert: true, new: true }).exec((err, new_user)=>{
                done(err, token, new_user);
            });
        }, 

      (token, user, done)=> {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'churchsapps@gmail.com',
                pass: 'pass_w0rd'
        }
        });
        var mailOptions = {
          from: 'churchsapps@gmail.com',
            to: user.email,
            subject: `${firstName} ${lastName}, here's the link to reset your password`,
            text: `Hi ${firstName} ${lastName},

            You are receiving this because you (or someone else) have requested the reset of the password for your account.

            To change your password, click here or paste the following link into your browser:
            
            ${req.headers.host}/reset/${token},
            
            This link will expire in 24 hours, so be sure to use it right away.

            If you did not request this, please ignore this email and your password will remain unchanged.
            
            Thanks!
            X-farms.
            `
        };

        transporter.sendMail(mailOptions, (err) => {
        res.json(`${info.response}, An e-mail has been sent to ${user.email} with further instructions.`);
          done(err, 'done');
        });
      }
    ], (err) => {
      if (err)
      res.status(422).json({ message: err });
    });
  };


/********************************
*       RESET PASSWORD          *  
* ******************************/
module.exports.reset_pword = (req, res, next)=> {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
        $gt: Date.now()
      }
    }).exec((err, user)=> {
      if (!err && user) {
        if (req.body.newPassword === req.body.verifyPassword) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err) {
            if (err) {
                return res.status(422).send({
                  message: err
                });
              } else {
                var mailOptions = {
                    to: user.email,
                  from: 'churchsapps@gmail.com',
                    subject: `${firstName} ${lastName}, your password was successfully reset`,
                    text: `Hi ${firstName} ${lastName},
 
                    You've successfully changed your password.
                     
                    Thanks !
                    X-farms.
                    `
                  };
                  smtpTransport.sendMail(mailOptions, (err) => {
                    if (!err) {
                      return res.json({ message: 'Password reset' });
                    } else {
                      return done(err);
                    }
                  });
                }
            });
          } else {
            return res.status(422).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    };