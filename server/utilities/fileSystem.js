import fs from 'file-system';
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

const fsHelper = { renameFile, deleteFile };

export default fsHelper;
