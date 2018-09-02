/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
import usersController from './users';
import questionsController from './questions';

const controllers = { usersController, questionsController };

export default controllers;
