const Share = require('../models/share');
const express = require('express');
const routes = express.Router();
const auth = require('../middleware/auth');

routes.get('/api/shares/getList/me' ,auth ,async (req, res)=>{
    try {
        const userIds = [req.user._id];
        const shares = await Share.getUserShares(userIds);
        res.status(200).send(shares);
    } catch (error) {
        res.status(500).send(error);
    }
});


routes.get('/api/shares/getList' ,auth ,async (req, res)=>{
    try {
        const userIds = req.query.ids.split(',');
        const shares = await Share.getSharesByIds(userIds);
        res.status(200).send(shares);
    } catch (error) {
        res.status(500).send(error);
    }
});


routes.post('/api/shares/new',auth , async(req,res)=>{
    try {
        const updates = Object.keys(req.body);
        const validUpdates = ['name', 'totalAmount', 'users','paidBy'];
        const isValidUpdate = updates.every((update) => {
            return validUpdates.includes(update);
        });
        if (isValidUpdate == false) {
            res.status(400).send({ error: 'invalid updates' });
        }
        const share = new Share(req.body);
        await share.save();
        res.status(200).send(share);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = routes;