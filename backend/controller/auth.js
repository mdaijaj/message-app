const mainIndex = require('../model/index');
const User= mainIndex.userModel;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET="aijajkhan"


exports.register = async (req, res) => {
    const { name, email, phone, role, password } = req.body;
    try {
        let user = await User.findOne({ where: { email: email } });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name,
            email,
            phone,
            role,
            password: hashedPassword
        });
        if(user){
            return res.json({data: user, message: "User created Successfully" });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        const token = jwt.sign({ user_id: user }, JWT_SECRET, { expiresIn: '1h' });

        user.online = true;
        await user.save();
        if(user){
            return res.json({ data: user, token: token, message: "Login Successfully!" });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.logout = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            user.online = false;
            await user.save();
        }
        res.json({ msg: 'Logged out successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
