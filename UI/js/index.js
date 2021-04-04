/* eslint-disable no-console */
window.onload = () => {
  const createNode = (element) => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  // Get saved data from sessionStorage
  const jwt = sessionStorage.getItem('jwt');

  const topnav = document.getElementById('topnav');
  const signInLink = document.getElementById('signInLink');
  const signOutLink = createNode('a');
  const signOutLinkSpan = createNode('span');
  const profileLink = document.getElementById('profileLink');

  // Onclick method for signing out
  const signOutMethod = () => {
    // Remove all saved data from sessionStorage
    sessionStorage.clear();
    window.location = 'signup.html';
  };

  signOutLink.innerHTML = 'signout';
  signOutLinkSpan.setAttribute('class', 'floatLeft');

  signOutLink.addEventListener('click', signOutMethod);

  const userOn = () => {
    signInLink.style.display = 'none';
    append(signOutLinkSpan, signOutLink);
    append(topnav, signOutLinkSpan);
  };

  const userOff = () => {
    signInLink.style.display = 'block';
    profileLink.style.display = 'none';
    signOutLink.style.display = 'none';
  };

  if (jwt) {
    userOn();
  } else {
    userOff();
  }

  const questionContainer = document.getElementById('questions');

  const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions/';
  const headers = new Headers({ 'x-access-token': jwt });
  const init = { method: 'GET', headers };

  fetch(url, init)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      if (data.auth === false) {
        userOff();
      } else {
        userOn();
      }

      const [questions] = [data.questions];
      return questions.forEach((question) => {
        const questionLink = createNode('a');
        const spanTitle = createNode('span');
        const spanTags = createNode('span');

        const titleNode = document.createElement('div');
        const tagsNode = document.createElement('div');
        const questionRow = document.createElement('div');

        // Onclick method for question link
        const questionLinkMethod = () => {
        // Save data to sessionStorage
          sessionStorage.setItem('questionId', question.id);
          window.location = 'question.html';
        };

        spanTitle.innerHTML = `${question.title}`;
        spanTags.innerHTML = `${question.tags}`;
        questionLink.setAttribute('href', '#');

        questionLink.addEventListener('click', questionLinkMethod);

        titleNode.setAttribute('class', 'col-12');
        titleNode.setAttribute('class', 'questionLink');
        tagsNode.setAttribute('class', 'col-12');
        tagsNode.setAttribute('class', 'questionTags');
        questionRow.setAttribute('class', 'row');
        questionRow.setAttribute('class', 'questionList');
        append(questionLink, spanTitle);
        append(titleNode, questionLink);
        append(tagsNode, spanTags);
        append(questionRow, titleNode);
        append(questionRow, tagsNode);
        append(questionContainer, questionRow);
      });
    }).catch((error) => console.log(error));
};

// eslint-disable-next-line
function myFunction() {
  const x = document.getElementById('topnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}
