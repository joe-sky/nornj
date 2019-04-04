//Set default data for first render NornJ html template.
ReactDOM.render(
  nj.renderH(document.getElementById('template-main').innerHTML, {
    store: store,
    history: _history,
    App: App
  }),
  document.getElementById('app')
);