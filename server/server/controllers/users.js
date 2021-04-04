/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import models from '../models';
import app from '../../app';
import errorHandler from './utilities/errorHandler';
import fileFilterMethod from './utilities/fileFilter';
import imageStorage from './utilities/filebaseStorage';

const [User] = [models.User];
const [uploadImageToStorage] = [imageStorage.uploadImageToStorage];
const [createHandlerError] = [errorHandler.createHandlerError]; // create handleError
// incomplete field handleError
const [incompleteFieldHandlerError] = [errorHandler.incompleteFieldHandlerError];
const [fileHandleError] = [errorHandler.fileHandleError]; // file handleError
const [usernameHandlerError] = [errorHandler.usernameHandlerError]; // username handleError
const [emailHandlerError] = [errorHandler.emailHandlerError]; // email handleError
const [phoneHandlerError] = [errorHandler.phoneHandlerError]; // phone handleError

const upload = multer({
  storage: multer.memoryStorage(),
});

const fileSizeLimit = 1024 * 1024 * 2;

// Token creation hanlder method
const tokenMethod = (userId) => {
  const token = jwt.sign(
    { id: userId }, app.get('superSecret'),
    { expiresIn: 86400 }, // expires in 24 hours
  );
  return token;
};

const usersController = {
  upload: upload.single('userImage'), // image upload
  create(req, res) { // create a user
    /* Required feilds */
    if (!req.body.username || !req.body.password || !req.body.email || !req.body.gender) {
      return incompleteFieldHandlerError(res);
    }
    // Auto-gen a salt and hash
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const [file] = [req.file];
    let fileName = '';

    /* Search to see if username, email and phone exist before creation
    to avoid skipping of id on unique constraint */
    User.findAll().then(async (results) => {
      const users = results.rows;
      let userCount = 0;
      for (const user of users) {
        if (req.body.username === user.username) return usernameHandlerError(res);
        if (req.body.email === user.email) return emailHandlerError(res);
        if (req.body.phone === user.phone) return phoneHandlerError(res);
        userCount += 1;
      }
      if (userCount === users.length) { // Create user after checking if it exist
        if (file) {
          // implementing the file filter method
          const fileError = fileFilterMethod(req, fileSizeLimit);
          if (fileError) return fileHandleError(res, fileError);
          try {
            fileName = await uploadImageToStorage(file, 'userImages');
          } catch (error) {
            return res.status(400).send(error);
          }
        }

        // Grab data from http request
        const data = {
          title: req.body.title,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          gender: req.body.gender,
          country: req.body.country,
          phone: req.body.phone,
          userImage: fileName,
        };

        User.create(data) // pass data to our model
          .then((result) => {
            const user = result.rows[0];
            const token = tokenMethod(user.id); // Generate token
            if (token) return res.status(201).send({ user, auth: true, token });
          }).catch((error) => createHandlerError(error, res, fileName));
      }
    }).catch((error) => createHandlerError(error, res));
  },
  check(req, res) { // login with username and password
    // pass data to our model
    User.findOne({ where: { username: req.body.username } })
      .then((result) => {
        const user = result.rows[0];
        // Returning error message for user not found
        if (!user) return res.status(400).send({ message: 'Invalid username/password' });
        // Compare hash from your password DB.
        const passIsEqual = bcrypt.compareSync(req.body.password, user.password);
        if (!passIsEqual) return res.status(404).send({ message: 'Invalid username/password' });
        const token = tokenMethod(user.id); // Generate token
        // Returning user detais
        if (token) return res.status(200).send({ user, auth: true, token });
      }).catch((e) => res.status(400).send(e));
  },
};

export default usersController;
