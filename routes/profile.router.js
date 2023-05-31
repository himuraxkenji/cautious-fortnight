const express = require('express');
const passport = require('passport');
const OrderService = require('../services/order.service');

const router = express.Router();
const service = OrderService();

router.get('/my-orders',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            const orders = await service.findByCustomer(user.sub);
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }
);