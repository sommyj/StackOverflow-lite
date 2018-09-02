/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */
import multer from 'multer';
import models from '../models';
import errorHandler from './utilities/errorHandler';
import fileFilterMethod from './utilities/fileFilter';
import authMethod from './utilities/authHandler';
import fsHelper from '../../utilities/fileSystem';

const [Answer] = [models.Answer];

const [createHandlerError] = [errorHandler.createHandlerError]; // create handleError
// incomplete field handleError
const [incompleteFieldHandlerError] = [errorHandler.incompleteFieldHandlerError];
const [fileTypeHandleError] = [errorHandler.fileTypeHandleError]; // file type handleError
const [fileSizeHandleError] = [errorHandler.fileSizeHandleError]; // file size handleError
// user deleted handleError
const [userNotPrestentHandlerError] = [errorHandler.userNotPrestentHandlerError];
const [noTokenHandlerError] = [errorHandler.noTokenHandlerError]; // no token provided handleError
// failed Authentication handlerError
const [failedAuthHandlerError] = [errorHandler.failedAuthHandlerError];

const [deleteFile] = [fsHelper.deleteFile];// Delete file helper method

const upload = multer({
  dest: './answersUploads/'
});

const fileSizeLimit = 1024 * 1024 * 2;

const answersController = {
  upload: upload.single('answerImage'), // image upload
  create(req, res) { // create a answer
    let decodedID;
    const authValues = authMethod(req);
    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return noTokenHandlerError(res);
    if (failedAuthError) return failedAuthHandlerError(res);
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;
    // implementing the file filter method
    const [fileSizeError, fileTypeError, filePath] = fileFilterMethod(req, fileSizeLimit, 'answersUploads');
    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);
    /* Required feilds */
    if (!req.body.response) return incompleteFieldHandlerError(res, filePath);

    const data = { // Grab data from http request
      response: req.body.response,
      userId: decodedID,
      questionId: req.params.questionId,
      answerImage: filePath,
    };
    Answer.create(data) // pass data to our model
      .then((result) => {
        const answer = result.rows[0];
        return res.status(201).send(answer);
      }).catch((error) => {
        if (error.name === 'error' && error.constraint === 'answers_userid_fkey') {
          return userNotPrestentHandlerError(res, filePath);
        }
        return createHandlerError(error, res, filePath);
      });
  },
};

export default answersController;
