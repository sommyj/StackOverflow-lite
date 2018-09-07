window.onload= () => {
  createNode = (element) => {
      return document.createElement(element);
  }

  append = (parent, el) => {
    return parent.appendChild(el);
  }

  const questionContainer = document.getElementById(`questions`);

  const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions/';

  // const headers = new Headers({/* 'x-access-token': ''});
  //
  // const init = { method: 'GET', headers };
  //
  // const request = new Request(url, init);

  fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    let questions = data;
    return questions.map((question) => {
      let a = createNode('a');
      let spanTitle = createNode('span');
      let spanTags = createNode('span');
      spanTitle.innerHTML = `${question.title}`;
      spanTags.innerHTML = `${question.tags}`;
      a.setAttribute("href", "#");
      const titleNode = document.createElement('div');
      const tagsNode = document.createElement('div');
      const questionRow = document.createElement('div');
      titleNode.setAttribute(`class`, `col-12`);
      titleNode.setAttribute(`class`, `questionLink`);
      tagsNode.setAttribute(`class`, `col-12`);
      tagsNode.setAttribute(`class`, `questionTags`);
      questionRow.setAttribute(`class`, `row`);
      questionRow.setAttribute(`class`, `questionList`);
      append(a, spanTitle);
      append(titleNode, a);
      append(tagsNode, spanTags);
      append(questionRow, titleNode);
      append(questionRow, tagsNode);
      append(questionContainer, questionRow);
    })
  }).catch((error) => {
    console.log(error);
  });


}
