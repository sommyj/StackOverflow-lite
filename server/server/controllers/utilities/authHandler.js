/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
import jwt from 'jsonwebtoken';
import app from '../../../app';

/* Authentication handle method */
const authMethod = (req) => {
  const authMethodArray = [];
  let noTokenProviderError = false;
  let failedAuth = false;
  let decodedID;

  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    noTokenProviderError = true;
  }

  // verifies secret and checks exp
  jwt.verify(token, app.get('superSecret'), (err, decoded) => {
    if (err) {
      if (!noTokenProviderError) {
        failedAuth = true;
      }
    } else decodedID = decoded.id;
  });

  authMethodArray[0] = noTokenProviderError;
  authMethodArray[1] = failedAuth;
  authMethodArray[2] = decodedID;

  return authMethodArray;
};

export default authMethod;
