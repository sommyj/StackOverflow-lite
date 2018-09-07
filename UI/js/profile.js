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
    return questions.map((question) => {
      let a = createNode('a');
      let spanTitle = createNode('span');
      spanTitle.innerHTML = `${question.title}`;
      a.setAttribute("href", "#");
      const titleNode = document.createElement('div');
      titleNode.setAttribute(`class`, `col-12`);
      titleNode.setAttribute(`class`, `questionLink`);
      append(a, spanTitle);
      append(titleNode, a);
      append(questionContainer, titleNode);
    })
    
    asked.innerHTML = `${questions.length}`;
  }).catch((error) => {
    console.log(error);
  });


}
