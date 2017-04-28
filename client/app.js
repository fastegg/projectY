import { h, render} from 'preact';
import * as App from 'client/App.jsx';


let root;
function init() {
  root = render(<App.default />, document.body, root);
}

console.log('loaded!');
init();