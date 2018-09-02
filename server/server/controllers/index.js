/*  eslint import/no-cycle: [2, { maxDepth: 1 }]  */
import usersController from './users';
import questionsController from './questions';
import answersController from './answers';

const controllers = { usersController, questionsController, answersController };

export default controllers;
