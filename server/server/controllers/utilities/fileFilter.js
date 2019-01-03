/* File filter handle method */
const fileFilterMethod = (req, fileSizeLimit) => {
  if (req.file) {
    if (!(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png')) {
      return 'Only .png and .jpg files are allowed!';
    }
    if (req.file.size >= fileSizeLimit) {
      return 'file should not be more than 2mb!';
    }
  }
};

export default fileFilterMethod;
