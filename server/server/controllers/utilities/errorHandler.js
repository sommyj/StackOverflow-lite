import fsHelper from '../../../utilities/fileSystem';

const [deleteFile] = [fsHelper.deleteFile];// Delete file helper method

const errorHandler = {
  createHandlerError(error, res, filePath) {
    if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
    return res.status(400).send(error);
  },
  incompleteFieldHandlerError(res, filePath) {
    if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
    return res.status(206).send({ message: 'Incomplete field' });
  },
  fileTypeHandleError(res) { // file type handleError
    res.status(403).json({ message: 'Only .png and .jpg files are allowed!', error: true });
  },
  fileSizeHandleError(res) { // file size handleError
    res.status(403).json({ message: 'file should not be more than 2mb!', error: true });
  },
  usernameHandlerError(res, filePath) {
    if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
    return res.status(400).send({ message: 'username already exists' });
  },
  emailHandlerError(res, filePath) {
    if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
    return res.status(400).send({ message: 'email already exists' });
  },
  phoneHandlerError(res, filePath) {
    if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
    return res.status(400).send({ message: 'phone already exists' });
  },
  questionHandlerError(res, filePath) {
    if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
    return res.status(400).send({ message: 'question already exists' });
  },
  userNotPrestentHandlerError(res, filePath) {
    if (filePath) deleteFile(`./${filePath}`); // if file uploads delete it
    return res.status(400).send({ message: 'user has been removed from the database' });
  },
  noTokenHandlerError(res) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  },
  failedAuthHandlerError(res) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
};

export default errorHandler;
