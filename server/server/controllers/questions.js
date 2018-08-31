/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */
import multer from 'multer';
import fs from 'file-system';
import jwt from 'jsonwebtoken';
import models from '../models';
import app from '../../app';

const [Question] = [models.Question];

const upload = multer({
  dest: './questionsUploads/'
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

/* File filter handle method */
const fileFilterMethod = (req) => {
  const fileErrorArray = [];
  let fileSizeError = false, fileTypeError = false, filePath = '';

  if (req.file) {
    const tempPath = `./${req.file.path}`;
    const targetPath = `./questionsUploads/${new Date().toISOString() + req.file.originalname}`;
    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
      if (req.file.size <= fileSizeLimit) {
        renameFile(tempPath, targetPath);
        // remove the dot in targetPath
        filePath = targetPath.substring(1, targetPath.length);
      } else { deleteFile(tempPath); fileSizeError = true; }
    } else { deleteFile(tempPath); fileTypeError = true; }
  }
  fileErrorArray[0] = fileSizeError; fileErrorArray[1] = fileTypeError;
  fileErrorArray[2] = filePath;

  return fileErrorArray;
};

/* Authentication handle method */
const authMethod = (req) => {
  const authMethodArray = [];
  let noTokenProviderError = false;
  let failedAuth = false;
  let decodedID;

  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    if (req.file) deleteFile(`./${req.file.path}`);
    noTokenProviderError = true;
  }

  // verifies secret and checks exp
  jwt.verify(token, app.get('superSecret'), (err, decoded) => {
    if (err) {
      if (!noTokenProviderError) {
        if (req.file) deleteFile(`./${req.file.path}`);
        failedAuth = true;
      }
    } else decodedID = decoded.id;
  });

  authMethodArray[0] = noTokenProviderError;
  authMethodArray[1] = failedAuth;
  authMethodArray[2] = decodedID;

  return authMethodArray;
};

const questionsController = {
  upload: upload.single('questionImage'), // image upload
  create(req, res) { // create a user
    let decodedID;
    const authValues = authMethod(req, res);
    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return res.status(401).send({ auth: false, message: 'No token provided.' });

    if (failedAuthError) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    // implementing the file filter method
    const [fileSizeError, fileTypeError, filePath] = fileFilterMethod(req);
    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);

    /* Required feilds */
    if (!req.body.title || !req.body.question || !req.body.tags) {
      if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
      return res.status(206).send({ message: 'Incomplete field' });
    }

    // Grab data from http request
    const data = {
      title: req.body.title,
      question: req.body.question,
      userId: decodedID,
      tags: req.body.tags,
      questionImage: filePath,
    };

    /* Search to see if question title exist before creation
    to avoid skipping of id on unique constraint */
    Question.findAll().then((results) => {
      const questions = results.rows; let questionCount = 0;
      for (const question of questions) {
        if (data.title === question.title) {
          if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
          return res.status(400).send({ message: 'question already exists' });
        }
        questionCount += 1;
      }
      if (questionCount === questions.length) { // Create question after checking if it exist
        Question.create(data) // pass data to our model
          .then((result) => {
            const question = result.rows[0];
            return res.status(201).send(question);
          }).catch((e) => {
            if (e.name === 'error' && e.constraint === 'questions_userid_fkey') {
              return res.status(400).send({ message: 'user has been removed from the database.' });
            }
            return res.status(400).send(e);
          });
      }
    }).catch(e => res.status(400).send(e));
  },
};

export default questionsController;
