/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */
import multer from 'multer';
import fs from 'file-system';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import models from '../models';
import app from '../../app';

const [User] = [models.User];

const upload = multer({
  dest: './usersUploads/'
});

const fileSizeLimit = 1024 * 1024 * 2;

/**
 * rename file to an appropriate name
 * @param {String} tempPath The temporary path name.
 * @param {String} targetPath The target path name.
 * @returns {void} nothing.
 */
const renameFile = (tempPath, targetPath) => {
  fs.rename(tempPath, targetPath, (err) => {
    if (err) throw err;
  });
};

/**
 * delete a file
 * @param {String} targetPath The part to delete from
 * @returns {void} nothing.
 */
const deleteFile = (targetPath) => {
  fs.unlink(targetPath, (err) => {
    if (err) throw err;
  });
};

// file type handleError
const fileTypeHandleError = (res) => {
  res.status(403).json({ message: 'Only .png and .jpg files are allowed!', error: true });
};

// file size handleError
const fileSizeHandleError = (res) => {
  res.status(403).json({ message: 'file should not be more than 2mb!', error: true });
};

// Token creation hanlder method
const tokenMethod = (userId) => {
  const token = jwt.sign(
    { id: userId }, app.get('superSecret'),
    { expiresIn: 86400 }// expires in 24 hours
  );
  return token;
};

/* File filter handle method */
const fileFilterMethod = (req) => {
  const fileErrorArray = [];
  let fileSizeError = false;
  let fileTypeError = false;
  let filePath = '';

  if (req.file) {
    const tempPath = `./${req.file.path}`;
    const targetPath = `./usersUploads/${new Date().toISOString() + req.file.originalname}`;
    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
      if (req.file.size <= fileSizeLimit) {
        renameFile(tempPath, targetPath);
        // remove the dot in targetPath
        filePath = targetPath.substring(1, targetPath.length);
      } else {
        deleteFile(tempPath);
        fileSizeError = true;
      }
    } else {
      deleteFile(tempPath);
      fileTypeError = true;
    }
  }
  fileErrorArray[0] = fileSizeError;
  fileErrorArray[1] = fileTypeError;
  fileErrorArray[2] = filePath;

  return fileErrorArray;
};


const usersController = {
  upload: upload.single('userImage'), // image upload
  create(req, res) { // create a user
    // implementing the file filter method
    const [fileSizeError, fileTypeError, filePath ] = fileFilterMethod(req);

    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);
    /* Required feilds */
    if (!req.body.username || !req.body.password || !req.body.email || !req.body.gender) {
      if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
      return res.status(206).send({ message: 'Incomplete field' });
    }
    //Auto-gen a salt and hash
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    // Grab data from http request
    const data = {title: req.body.title, firstname: req.body.firstname,
      lastname: req.body.lastname, username: req.body.username,
      password: hashedPassword, email: req.body.email,
      gender: req.body.gender, country: req.body.country,
      phone: req.body.phone, userImage: filePath};
    /* Search to see if username, email and phone exist before creation
    to avoid skipping of id on unique constraint */
    User.findAll().then((results) => {
      const users = results.rows;
      let userCount = 0;
      for (const user of users) {
        if (data.username === user.username) {
          if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
          return res.status(400).send({ message: 'username already exists' }); }
        if (data.email === user.email) {
          if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
          return res.status(400).send({ message: 'email already exists' }); }
        if (data.phone === user.phone) {
          if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
          return res.status(400).send({ message: 'phone already exists' }); }
          userCount += 1;
      }
      //Create user after checking if it exist
      if(userCount === users.length) {
      User.create(data) // pass data to our model
        .then((result) => { const user = result.rows[0];
          const token = tokenMethod(user.id); // Generate token
          if (token) return res.status(201).send({ user, auth: true, token });
        }).catch(e => res.status(400).send(e)); }
    }).catch(e => res.status(400).send(e));
  },
  check(req, res) { // login with username and password
    // pass data to our model
    User.findOne({ where: { username: req.body.username } })
      .then((result) => { const user = result.rows[0];
        // Returning error message for user not found
        if (!user) return res.status(400).send({ message: 'Invalid username/password' });
        // Compare hash from your password DB.
        const passIsEqual = bcrypt.compareSync(req.body.password, user.password)
        if (!passIsEqual) return res.status(404).send({ message: 'Invalid username/password' });
        const token = tokenMethod(user.id); // Generate token
        // Returning user detais
        if (token) return res.status(200).send({ user, auth: true, token });
      }).catch(e => res.status(400).send(e));
  },
};

export default usersController;
