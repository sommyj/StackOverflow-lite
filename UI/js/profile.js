/* eslint-disable no-console */
window.onload = () => {
  const createNode = element => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  const jwt = sessionStorage.getItem('jwt');

  const topnav = document.getElementById('topnav');
  const signInLink = document.getElementById('signInLink');
  const signOutLink = createNode('a');
  const signOutLinkSpan = createNode('span');

  // Onclick method for signing out
  const signOutMethod = () => {
    // Remove all saved data from sessionStorage
    sessionStorage.clear();
    window.location = 'signup.html';
  };

  signOutLink.innerHTML = 'signout';
  // signOutLink.setAttribute('href', 'signup.html');
  signOutLinkSpan.setAttribute('class', 'floatLeft');

  signOutLink.addEventListener('click', signOutMethod);

  if (jwt) {
    signInLink.style.display = 'none';

    append(signOutLinkSpan, signOutLink);
    append(topnav, signOutLinkSpan);
  } else {
    signInLink.style.display = 'block';
    signInLink.setAttribute('id', '#signupLink');
  }

  const questionContainer = document.getElementById('recentQuestion');
  const asked = document.getElementById('questionAsked');

  const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions?userId';
  const headers = new Headers({ 'x-access-token': jwt });
  const init = { method: 'GET', headers };
  const request = new Request(url, init);

  fetch(request)
    .then(resp => resp.json())
    .then((data) => {
      const questions = data;
      asked.innerHTML = `${questions.length}`;
      return questions.forEach((question) => {
        const questionLink = createNode('a');
        const spanTitle = createNode('span');
        const colNode = document.createElement('div');
        const rowNode = document.createElement('div');
        // Onclick method for question link
        const questionLinkMethod = () => {
        // Save data to sessionStorage
          sessionStorage.setItem('questionId', question.id);
          window.location = 'question.html';
        };

        spanTitle.innerHTML = `${question.title}`;
        rowNode.setAttribute('class', 'row');
        rowNode.setAttribute('class', 'questionList');
        colNode.setAttribute('class', 'col-12');
        colNode.setAttribute('class', 'questionLink');
        questionLink.setAttribute('href', '#');

        questionLink.addEventListener('click', questionLinkMethod);

        append(questionLink, spanTitle);
        append(colNode, questionLink);
        append(rowNode, colNode);
        append(questionContainer, rowNode);
      });
    }).catch((error) => {
      console.log(error);
    });
};
