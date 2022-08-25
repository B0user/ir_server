const mongoose = require('mongoose');
const ROLES_LIST = require('../../config/roles_list');
const {User} = require('../../model/Schemas');
const bcrypt = require('bcrypt');

const addUserAdmin = async (req, res) => {
    const { user, pwd, roles } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    try {
        const duplicate = await User.findOne({ username: user }).exec();
        if (duplicate) return res.sendStatus(409); //Conflict 
        try {
            //encrypt the password
            const hashedPwd = await bcrypt.hash(pwd, 10);
    
            //create and store the new user
            const result = await User.create({
                "username": user,
                "password": hashedPwd,
                "roles": {
                    User: roles.User ? ROLES_LIST.User : null,
                    Client: roles.Client ? ROLES_LIST.Client : null
                }
            });
    
            res.status(201).json({ 'success': `New user ${user} created!` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ 'message': err.message });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) return res.status(204).json({ 'message': 'No users found' });
        res.json(users);
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}

const getUser = async (req, res) => {
    const  { id } = req.params;
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    try {
        const user = await User.findOne({ _id: id }).exec();
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${id} not found` });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}

const deleteUser = async (req, res) => {
    const  { id } = req.params;
    if (!id) return res.status(400).json({ "message": 'User ID required' });
    try { 
        const user = await User.findOne({ _id: id }).exec();
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${id} not found` });
        }
        const result = await user.deleteOne({ _id: id });
        res.json(result);
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    if (!id || !user) return res.status(400).json({ "message": 'Wrong request' });
    // Check for unique username
    try { 
        const matchingUsername = await User.findOne({username: user}).exec();
        if (matchingUsername) return res.sendStatus(409);

        const foundUser = await User.findById(id).exec();
        if (!foundUser) return res.sendStatus(401);
        try {
            foundUser.username = user;
            const result = await foundUser.save();
            return res.json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}

const updateUserAdmin = async (req, res) => {
    const { id } = req.params;
    const { user, roles } = req.body;
    if (!id || !user) return res.status(400).json({ "message": 'Wrong request' });
    // Check for unique username
    try {
        const foundUser = await User.findById(id).exec();
        if (foundUser.username !== user){
            const matchingUsername = await User.findOne({username: user}).exec();
            if (matchingUsername && foundUser) return res.sendStatus(409);
        }
        if (!foundUser) return res.sendStatus(401);
        try {
            foundUser.username = user;
            foundUser.roles = {
                User: roles.User ? ROLES_LIST.User : null,
                Client: roles.Client ? ROLES_LIST.Client : null
            };
            const result = await foundUser.save();
            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json(err);
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
}

const getUser_id = async (name) => {
    try {
        const id = await User.findOne({username: name}, '_id');
        return id._id;
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    addUserAdmin,
    getAllUsers,
    deleteUser,
    updateUser,
    updateUserAdmin,
    getUser,
    getUser_id
}