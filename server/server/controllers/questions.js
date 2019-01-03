/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
/* eslint-disable no-restricted-syntax */
import multer from 'multer';
import models from '../models';
import errorHandler from './utilities/errorHandler';
import fileFilterMethod from './utilities/fileFilter';
import authMethod from './utilities/authHandler';
import imageStorage from './utilities/filebaseStorage';

const [Question] = [models.Question];
const [Answer] = [models.Answer];
const [uploadImageToStorage] = [imageStorage.uploadImageToStorage];
const [deleteImageFromStorage] = [imageStorage.deleteImageFromStorage];
const [getImageFromStorage] = [imageStorage.getImageFromStorage];
const [createHandlerError] = [errorHandler.createHandlerError]; // create handleError
// incomplete field handleError
const [incompleteFieldHandlerError] = [errorHandler.incompleteFieldHandlerError];
const [fileHandleError] = [errorHandler.fileHandleError]; // file handleError
const [questionHandlerError] = [errorHandler.questionHandlerError]; // question handleError
// user deleted handleError
const [userNotPrestentHandlerError] = [errorHandler.userNotPrestentHandlerError];
const [noTokenHandlerError] = [errorHandler.noTokenHandlerError]; // no token provided handleError
// failed Authentication handlerError
const [failedAuthHandlerError] = [errorHandler.failedAuthHandlerError];
// parameters handlerError
const [parametersHandlerError] = [errorHandler.parametersHandlerError];

const upload = multer({
  storage: multer.memoryStorage()
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

    /* Required feilds */
    if (!req.body.title || !req.body.question || !req.body.tags) {
      return incompleteFieldHandlerError(res);
    }

    const [file] = [req.file];
    let fileName = '';
    /* Search to see if question title exist before creation
    to avoid skipping of id on unique constraint */
    Question.findAll().then(async (results) => {
      const questions = results.rows; let questionCount = 0;
      for (const question of questions) {
        if (req.body.title === question.title) return questionHandlerError(res);
        questionCount += 1;
      }
      if (questionCount === questions.length) { // Create question after checking if it exist
        if (file) {
          // implementing the file filter method
          const fileError = fileFilterMethod(req, fileSizeLimit);
          if (fileError) return fileHandleError(res, fileError);
          try {
            fileName = await uploadImageToStorage(file, 'questionImages');
          } catch (error) {
            return res.status(400).send(error);
          }
        }

        // Grab data from http request
        const data = {
          title: req.body.title,
          question: req.body.question,
          userId: decodedID,
          tags: req.body.tags,
          questionImage: fileName,
        };
        Question.create(data) // pass data to our model
          .then((result) => {
            const question = result.rows[0];
            return res.status(201).send(question);
          }).catch((error) => {
            if (error.name === 'error' && error.constraint === 'questions_userid_fkey') {
              return userNotPrestentHandlerError(res, fileName);
            }
            return createHandlerError(error, res, fileName);
          });
      }
    }).catch(error => createHandlerError(error, res));
  },
  list(req, res) {
    let decodedID; // Identity gotten from jwt
    let auth = false; // Session authentication
    const authValues = authMethod(req);

    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    // Check if token is still valid
    if (noTokenProviderError) {
      auth = false;
    } else if (failedAuthError) auth = false;
    else auth = true;

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    let selectionType;
    if (req.query.userId) {
      selectionType = Question
        .findAll({ where: { userId: decodedID }, order: ['createdat', 'DESC'] });
    } else {
      selectionType = Question.findAll({ order: ['createdat', 'DESC'] });
    }
    selectionType.then((results) => {
      const questions = results.rows;
      return res.status(200).send({ questions, auth });
    }).catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    let decodedID; // Identity gotten from jwt
    let auth = false; // Session authentication
    const authValues = authMethod(req);

    const noTokenProviderError = authValues[0];
    const failedAuthError = authValues[1];
    const decodedIDFromMethod = authValues[2];

    // Check if token is still valid
    if (noTokenProviderError) {
      auth = false;
    } else if (failedAuthError) auth = false;
    else auth = true;

    if (decodedIDFromMethod) decodedID = decodedIDFromMethod;

    if (parametersHandlerError(req)) {
      return res.status(400).send({ message: 'question not found' });
    }

    Question.findById(req.params.questionId).then((result) => {
      const question = result.rows[0];
      if (!question) return res.status(404).send({ message: 'question not found' });
      // Getting answers to the question
      Answer.findOne({ where: { questionid: question.id }, order: ['createdat', 'ASC'] }).then(async (answer) => {
        if (decodedID === question.userid) question.user = true;
        else question.user = false;
        question.auth = auth;
        question.answers = answer.rows;
        if (question.questionimage) {
          try {
            const imageResponse = await getImageFromStorage(question.questionimage);
            question.questionimage = imageResponse.mediaLink;
          } catch (error) {
            return res.status(400).send(error);
          }
          question.answers.map(async (answerQues) => {
            if (answerQues.answerimage) {
              try {
                const ansImageResponse = await getImageFromStorage(answerQues.answerimage);
                answerQues.answerimage = ansImageResponse.mediaLink;
              } catch (error) {
                return res.status(400).send(error);
              }
            }
          });
        }
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

    if (parametersHandlerError(req, res)) {
      return res.status(400).send({ message: 'question not found' });
    }

    Question.findById(req.params.questionId).then((result) => {
      const question = result.rows[0];
      if (!question) return res.status(404).send({ message: 'question not found' });
      if (decodedID !== question.userid) {
        return res.status(403).send({ auth: false, message: 'User not allowed' });
      }
      Question.destroy({ where: { id: question.id } }).then(async () => {
        if (question.questionimage) {
          try {
            await deleteImageFromStorage(question.questionimage);
          } catch (error) {
            return res.status(400).send(error);
          }
        }
        return res.status(204).send();
      });
    }).catch(error => res.status(400).send(error));
  },
};

export default questionsController;
