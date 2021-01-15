module.exports = (plop) => {
  plop.setGenerator('page', {
    description: 'Create page component',

    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your page component name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/pages/{{name}}/index.js',
        templateFile: 'plop-templates/index.js.hbs',
      },
      {
        type: 'add',
        path: 'src/pages/{{name}}/{{name}}.js',
        templateFile: 'plop-templates/pageComponent.js.hbs',
      },
    ],
  })
}
