'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebaseAdmin = require('firebase-admin');

var admin = _interopRequireWildcard(_firebaseAdmin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var env = process.env.NODE_ENV; /* eslint-disable no-console */


var projectId = process.env.PROJECT_ID;
var key = process.env.KEY;
key = key.replace(/\\n/g, '\n');
var bucketName = void 0;

if (env === 'production') {
  bucketName = process.env.PROC_BUCKET;
} else {
  bucketName = process.env.DEV_BUCKET;
}

// Set the configuration for your app
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: projectId,
    private_key: '-----BEGIN PRIVATE KEY-----\n' + key + '\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-er0j4@' + projectId + '.iam.gserviceaccount.com'
  }),
  storageBucket: bucketName
});

var storage = admin.storage();

var bucket = storage.bucket();

var imageStorage = {
  /**
  * Upload the image file to Google storage
  * @param {file} file object that will be uploaded to Google storage
  * @param {folder} folder file folder name
  * @returns {fileName} The file name uploaded.
  */
  uploadImageToStorage: function uploadImageToStorage(file, folder) {
    var prom = new Promise(function (resolve, reject) {
      if (!file) {
        reject(new Error('No image file'));
      }
      var newFileName = folder + '/' + file.originalname + '_' + Date.now();

      var fileUpload = bucket.file(newFileName);

      var blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });

      blobStream.on('error', function (error) {
        reject(error);
        // reject(new Error('Something is wrong! Unable to upload at the moment.'));
      });

      blobStream.on('finish', function () {
        var fileName = fileUpload.name;

        // Make file public
        bucket.file(fileName).makePublic(function () /* err, apiResponse */{});

        resolve(fileName);
      });

      blobStream.end(file.buffer);
    });

    return prom;
  },
  getImageFromStorage: function getImageFromStorage(fileName) {
    var file = bucket.file(fileName);

    return file.get().then(function (data) {
      var apiResponse = data[1];
      return apiResponse;
    });
  },
  deleteImageFromStorage: function deleteImageFromStorage(fileName) {
    var file = bucket.file(fileName);

    file.delete().then(function () {
      console.log(fileName + ' deleted.');
    }).catch(function (err) {
      console.error('ERROR:', err);
    });
  }
};

/* eslint-enable no-console */
exports.default = imageStorage;