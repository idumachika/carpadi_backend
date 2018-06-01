const _ = require('lodash');
const express = require('express');
router = express.Router();
const User = require('../models/user');

     /****************************************************
      *   To find a single user by email                 *
      ****************************************************/
    router.post('/user/person', (req, res)=>{
        let {email:email} = req.body;
        User.findOne({ email }, "-password", (err, doc)=>{
            if(err){
                console.log(err)
                           
            }else{
                res.status(200).json({message:"The user's detail is shown below", doc:doc})
            }
        })
    })



/*****************************************************
*         To view all registered users by admin         *
******************************************************/

    router.get('/allUsers', (req, res)=>{
        return User.find({},"-password")
        .then(doc=>{
            return res.status(200).json({message:"List of all registered users", doc:doc})
        })
        .catch(err=>{
            return res.status(400).json({message:"Sorry an error has occured"})
        })
    })

/***********************************************
*        For editing of users by admin         *
***********************************************/
    router.post('/editUser', (req, res)=>{
        let {email:email} = req.body;
        return User.update({email}, 
            {$set:req.body})
            .then(doc=>{
                return res.status(200).json({status:200, message:"User successfully updated", doc:doc})
            })
            .catch(err=>{
                return res.status(400).json(err)
            })
    });
    
/*************************************************
*   To upgrade a default user to an admin        *
**************************************************/
    router.post('/upgradeAdmin', (req, res)=>{
        let {email, password} = req.body;
        return User.update({email}, "-password",
             {$set:req.body})
             .then(doc=>{
                 return res.status(200).json({status:200, message:"User successfully upgraded to an admin", doc:doc})
             })
             .catch(err=>{
                 return res.status(400).json(err)
             })
     });


/*****************************************
*   To delete a user by the admin        *
*****************************************/     
    router.post('/deleteUser', (req, res)=>{
        return User.findOneAndRemove(req.body)
            .then(ok =>{
                return res.status(200).json({status:200, message:"User's Account successfully deleted"})
            })
            .catch(err=>{
                return res.status(err).json(err)
            })
    })
    
/******************
 * Export router  *
 ******************/
module.exports = router;
