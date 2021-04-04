/* eslint-disable no-console */
import * as admin from 'firebase-admin';

const env = process.env.NODE_ENV;

const projectId = process.env.PROJECT_ID;
let key = process.env.KEY;
key = key.replace(/\\n/g, '\n');
let bucketName;

if (env === 'production') {
  bucketName = process.env.PROC_BUCKET;
} else {
  bucketName = process.env.DEV_BUCKET;
}

// Set the configuration for your app
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: projectId,
    private_key: `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----\n`,
    client_email: `firebase-adminsdk-er0j4@${projectId}.iam.gserviceaccount.com`,
  }),
  storageBucket: bucketName,
});

const storage = admin.storage();

const bucket = storage.bucket();

const imageStorage = {
  /**
  * Upload the image file to Google storage
  * @param {file} file object that will be uploaded to Google storage
  * @param {folder} folder file folder name
  * @returns {fileName} The file name uploaded.
  */
  uploadImageToStorage(file, folder) {
    const prom = new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No image file'));
      }
      const newFileName = `${folder}/${file.originalname}_${Date.now()}`;

      const fileUpload = bucket.file(newFileName);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on('error', (error) => {
        reject(error);
        // reject(new Error('Something is wrong! Unable to upload at the moment.'));
      });

      blobStream.on('finish', () => {
        const fileName = fileUpload.name;

        // Make file public
        bucket.file(fileName).makePublic((/* err, apiResponse */) => {});

        resolve(fileName);
      });

      blobStream.end(file.buffer);
    });

    return prom;
  },
  getImageFromStorage(fileName) {
    const file = bucket.file(fileName);

    return file.get().then((data) => {
      const apiResponse = data[1];
      return apiResponse;
    });
  },
  deleteImageFromStorage(fileName) {
    const file = bucket.file(fileName);

    file.delete().then(() => {
      console.log(`${fileName} deleted.`);
    })
      .catch((err) => {
        console.error('ERROR:', err);
      });
  },

};

/* eslint-enable no-console */
export default imageStorage;
