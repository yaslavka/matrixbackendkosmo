const ApiError = require("../error/ApiError");
const { User } = require("../models/models");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const generator = require('generate-password');
const jwt_decode = require("jwt-decode");
const fetch = require('node-fetch');


class SettingsControllers {

    async finPass(req, res, next) {
        try {
            const { new_password, old_password } = req.body;
            const { authorization } = req.headers;
            const token = authorization.slice(7);
            const decodeToken = jwt_decode(token);
            const user = await User.findOne({
              where: { username: decodeToken.username },
            });
            if (old_password !== ''){
                let comparePassword = bcrypt.compareSync(old_password, user.finance_password);
                if (!comparePassword) {
                  return next(ApiError.internal("Неверный пароль"));
                }
            }
            const hashPassword = await bcrypt.hash(new_password, 5);
            let updateFinPassword = {finance_password: hashPassword}
            await User.update(updateFinPassword, {where:{id:user.id}})
            return res.json(true)
        } catch (error) {
            return res.json(error)
        }

    }
    async restore(req, res, next) {
        try {
            let { email } = req.body;
            const user = await User.findOne({ where: { email } })
            if (!user) {
                return next(ApiError.badRequest("Такой пользователь не найден"));
            }
            const emailLogin = 'ayjemalgurbanowa64@gmail.com'
            const emailPassword = 'sprbgznjpcqzgirt'
            const password = generator.generate({
                length: 10,
                numbers: true
            });
            const hashPassword = await bcrypt.hash(password, 5);
            let update = {password: hashPassword}
            await User.update(update, {where:{id:user.id}})
            const SERVICE_PLAN_ID = '94918226be9d4ee6a563e554422a7c36';
            const API_TOKEN = '007501898ead43968056603165591db5';
            const SINCH_NUMBER = '+447520650985';
            const TO_NUMBER = `${user.phone}`;
            const resp = await fetch(
                'https://us.sms.api.sinch.com/xms/v1/' + SERVICE_PLAN_ID + '/batches',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + API_TOKEN
                    },
                    body: JSON.stringify({
                        from: SINCH_NUMBER,
                        to: [TO_NUMBER],
                        body: `Здравствуйте! Вы выполнили запрос на восстановление пароля на сайте https://x-life.host/
Ваш логин: ${user.username} 
Ваш новый пароль: ${password}`
                    })
                }
            );
            const data = await resp.json();
            console.log(data);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailLogin,
                    pass: emailPassword
                }
            });

            const mailOptions = {
                from: 'X-life',
                to: email,
                subject: 'Новый пароль от X-Life',
                text: `Здравствуйте! 

                Вы выполнили запрос на восстановление пароля на сайте https://x-life.host/
                
                Ваш логин: ${user.username} 
                Ваш новый пароль: ${password} 
                
                Данное сообщение отправлено автоматически, отвечать на него не нужно. `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return res.json({message: 'Новый пароль выслан вам на почту проверте папку спам'})
        } catch (error) {
             return res.json({message:error})
        }

    }

}

module.exports = new SettingsControllers();


