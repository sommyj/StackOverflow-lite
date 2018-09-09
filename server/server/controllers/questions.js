/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */
import multer from 'multer';
import models from '../models';
import errorHandler from './utilities/errorHandler';
import fileFilterMethod from './utilities/fileFilter';
import authMethod from './utilities/authHandler';
import fsHelper from '../../utilities/fileSystem';

const [Question] = [models.Question];
const [Answer] = [models.Answer];

const [createHandlerError] = [errorHandler.createHandlerError]; // create handleError
// incomplete field handleError
const [incompleteFieldHandlerError] = [errorHandler.incompleteFieldHandlerError];
const [fileTypeHandleError] = [errorHandler.fileTypeHandleError]; // file type handleError
const [fileSizeHandleError] = [errorHandler.fileSizeHandleError]; // file size handleError
const [questionHandlerError] = [errorHandler.questionHandlerError]; // question handleError
// user deleted handleError
const [userNotPrestentHandlerError] = [errorHandler.userNotPrestentHandlerError];
const [noTokenHandlerError] = [errorHandler.noTokenHandlerError]; // no token provided handleError
// failed Authentication handlerError
const [failedAuthHandlerError] = [errorHandler.failedAuthHandlerError];

const [deleteFile] = [fsHelper.deleteFile];// Delete file helper method

const upload = multer({
  dest: './questionsUploads/'
});

const fileSizeLimit = 1024 * 1024 * 2;

const questionsController = {
  upload: upload.single('questionImage'), // image upload
  create(req, res) { // create a question
    let decodedID;
    const authValues = authMethod(req);
    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return noTokenHandlerError(res);
    if (failedAuthError) return failedAuthHandlerError(res);
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;
    // implementing the file filter method
    const [fileSizeError, fileTypeError, filePath] = fileFilterMethod(req, fileSizeLimit, 'questionsUploads');
    if (fileSizeError) return fileSizeHandleError(res);
    if (fileTypeError) return fileTypeHandleError(res);
    /* Required feilds */
    if (!req.body.title || !req.body.question || !req.body.tags) {
      return incompleteFieldHandlerError(res, filePath);
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
        if (data.title === question.title) return questionHandlerError(res, filePath);
        questionCount += 1;
      }
      if (questionCount === questions.length) { // Create question after checking if it exist
        Question.create(data) // pass data to our model
          .then((result) => {
            const question = result.rows[0];
            return res.status(201).send(question);
          }).catch((error) => {
            if (error.name === 'error' && error.constraint === 'questions_userid_fkey') {
              return userNotPrestentHandlerError(res, filePath);
            }
            return createHandlerError(error, res, filePath);
          });
      }
    }).catch(error => createHandlerError(error, res, filePath));
  },
  list(req, res) {
    let selectionType;
    if (req.query.userId) {
      selectionType = Question
        .findAll({ where: { userId: req.query.userId }, order: ['createdat', 'DESC'] });
    } else {
      selectionType = Question.findAll({ order: ['createdat', 'DESC'] });
    }
    selectionType.then((results) => {
      const questions = results.rows;
      return res.status(200).send(questions);
    }).catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    Question.findById(req.params.questionId).then((result) => {
      const question = result.rows[0];
      if (!question) return res.status(404).send({ message: 'question not found' });
      // Getting answers to the question
      Answer.findOne({ where: { questionid: question.id } }).then((answer) => {
        question.answers = answer.rows;
        return res.status(200).send(question);
      })
        .catch(error => res.status(400).send(error));
    }).catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    let decodedID;
    const authValues = authMethod(req);
    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    if (noTokenProviderError) return noTokenHandlerError(res);
    if (failedAuthError) return failedAuthHandlerError(res);
    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    Question.findById(req.params.questionId).then((result) => {
      const question = result.rows[0];
      if (!question) return res.status(404).send({ message: 'question not found' });
      if (decodedID !== question.userid) {
        return res.status(403).send({ auth: false, message: 'User not allowed' });
      }
      Question.destroy({ where: { id: question.id } }).then(() => {
        if (question.questionimage) {
          deleteFile(`./${question.questionimage}`);
        }
        return res.status(204).send();
      });
    }).catch(error => res.status(400).send(error));
  },
};

export default questionsController;
