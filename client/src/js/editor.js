// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb, postDb } from './database';
import { header } from './header';

export default class {

  constructor() {
    let dbIndex = -1;
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }    
    
    try {
      this.editor = CodeMirror(document.querySelector('#main'), {
        value: '',
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        indentUnit: 2,
        tabSize: 2,
      });
    } catch (err) {
        console.log(err)
    }
    
    // Get the database record in the IndexedDB database and set the "content" to the editor window
    fetchContent().then((data) => {
      dbIndex = data[0].id;
      this.editor.setValue(data[0].content);
    })

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor when the editor itself loses focus
    this.editor.on('blur', () => {
      putDb (dbIndex, localStorage.getItem('content'));
    });
  }
}

const fetchContent = async () => {

  // Get the record in IndexDB database
  let contents = '';
  let data = await getDb();
  if (data.length === 0) {
    // No record was found in IndexDB database - add the header value
    await postDb(header);
    // Get the record that was just added
    data = await getDb();
  }
  
  return data;
}