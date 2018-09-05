/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */
import multer from 'multer';
import models from '../models';
import errorHandler from './utilities/errorHandler';
import fileFilterMethod from './utilities/fileFilter';
import authMethod from './utilities/authHandler';
import fsHelper from '../../utilities/fileSystem';

const [Answer] = [models.Answer];
const [Question] = [models.Question];

const [createHandlerError] = [errorHandler.createHandlerError]; // create handleError
// incomplete field handleError
const [incompleteFieldHandlerError] = [errorHandler.incompleteFieldHandlerError];
const [notFoundHandlerError] = [errorHandler.notFoundHandlerError];
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
  update(req, res) { // update business
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

    Question.findById(req.params.questionId).then((result1) => {
      const question = result1.rows[0];
      if (!question) return notFoundHandlerError('question', res, filePath);
      Answer.findById(req.params.answerId).then((result2) => {
        const answer = result2.rows[0];
        if (!answer) return notFoundHandlerError('answer', res, filePath);
        // For accepting an answer by the author of the question
        if (decodedID === question.userid && req.body.accepted) {
          return Answer.update({
            id: answer.id,
            response: answer.response,
            accepted: req.body.accepted || answer.accepted,
            vote: answer.vote,
            answerImage: answer.answerimage,
          }).then(result3 => res.status(200).send(result3.rows[0]))
            .catch(error => createHandlerError(error, res, filePath));
        }
        // For updating an answer by the author of the answer
        if (decodedID === answer.userid) {
          // holds the url of the image before update in other not to loose it
          const previousImage = answer.answerimage;
          return Answer.update({
            id: answer.id,
            response: req.body.response || answer.response,
            accepted: answer.accepted,
            vote: answer.vote,
            answerImage: filePath || answer.answerimage,
          }).then((result4) => {
            // if file and url is not empty delete img for updation
            if (filePath) {
              if (previousImage) deleteFile(`./${previousImage}`);
            }
            return res.status(200).send(result4.rows[0]);
          }).catch(error => createHandlerError(error, res, filePath));
        }
        return res.status(403).send({ auth: false, message: 'User not allowed' });
      }).catch(error => createHandlerError(error, res, filePath));
    }).catch(error => createHandlerError(error, res, filePath));
  }
};

export default answersController;
