window.onload= () => {
  createNode = (element) => {
      return document.createElement(element);
  }

  append = (parent, el) => {
    return parent.appendChild(el);
  }

  const questionContainer = document.getElementById(`recentQuestion`);
  const asked = document.getElementById(`questionAsked`);

  const url = 'https://stackoverflow-lite-1.herokuapp.com/v1/questions?userId=1';

  fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    let questions = data;
    asked.innerHTML = `${questions.length}`;
    return questions.map((question) => {
      let a = createNode('a');
      let spanTitle = createNode('span');
      spanTitle.innerHTML = `${question.title}`;
      a.setAttribute("href", "#");
      const colNode = document.createElement('div');
      const rowNode = document.createElement('div');
      rowNode.setAttribute(`class`, `row`);
      rowNode.setAttribute(`class`, `questionList`);
      colNode.setAttribute(`class`, `col-12`);
      colNode.setAttribute(`class`, `questionLink`);
      append(a, spanTitle);
      append(colNode, a);
      append(rowNode, colNode);
      append(questionContainer, rowNode);
    })
  }).catch((error) => {
    console.log(error);
  });


}
