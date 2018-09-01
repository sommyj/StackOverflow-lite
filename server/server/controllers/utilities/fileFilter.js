import fsHelper from '../../../utilities/fileSystem';

const renameFile = [fsHelper.renameFile];// Rename file helper method
const deleteFile = [fsHelper.deleteFile];// Delete file helper method

/* File filter handle method */
const fileFilterMethod = (req, fileSizeLimit, folderName) => {
  const fileErrorArray = [];
  let fileSizeError = false, fileTypeError = false, filePath = '';

  if (req.file) {
    const tempPath = `./${req.file.path}`;
    const targetPath = `./${folderName}/${new Date().toISOString() + req.file.originalname}`;
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

export default fileFilterMethod;
