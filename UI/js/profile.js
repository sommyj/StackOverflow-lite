/* eslint-disable no-console */
window.onload = () => {
  const createNode = element => document.createElement(element);

  const append = (parent, el) => parent.appendChild(el);

  const questionContainer = document.getElementById('recentQuestion');
  const asked = document.getElementById('questionAsked');

  const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions?userId=1';

  fetch(url)
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
