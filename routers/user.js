const express = require("express");
const User = require("../models/user");
const auth = require('../middleware/auth');
const routes = express.Router();

//Get user profile
routes.get("/api/user/me", auth, async (req,res) => {
    try {
        //will be handled in middleware
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

routes.post("/api/user",async (req, res)=>{
    try {
        const user = new User(req.body);
        await user.save();

        const token = await user.GenerateAuthToken();
        res.status(200).send({user, token});
    } catch (error) {
        res.status(500).send(error);
    }
});

routes.post("/api/user/login", async (req, res)=> {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.GenerateAuthToken();
        if (user) {
            res.status(200).send({
                user, token
            });
        }
        else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}); 

routes.post("/api/user/logout",auth, async (req, res)=> {
    try {
        for(let i = 0; i < req.user.tokens.length; i++) {
            if(req.user.tokens[i].token == req.token) {
                req.user.tokens.splice(i, 1);
                await req.user.save();
                break;
            }
        }
        res.status(200).send("logout successfull");
    } catch (error) {
        res.status(500).send(error);
    }
}); 

routes.post("/api/user/logoutall",auth, async (req, res)=> {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send("logout successfull");
    } catch (error) {
        res.status(500).send(error);
    }
}); 

routes.delete('/users/me',auth, async(req,res)=>{
    try {
        await req.user.remove();
        res.send(req.user);
    } catch(err){
        res.status(500).send(err);
    }
});

//update user
routes.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const validUpdates = ['name', 'email', 'password'];
    const isValidUpdate = updates.every((update) => {
        return validUpdates.includes(update);
    });
    if (isValidUpdate == false) {
        res.status(400).send({ error: 'invalid updates' });
    }

    try {
        // this work is done to call mongodb middleware schema, on save
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = routes;