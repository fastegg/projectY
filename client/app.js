import { h, render} from 'preact';
import * as App from 'client/App.jsx';


let root;
function init() {
  root = render(<App.default />, document.body, root);
}

if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!  
	module.hot.accept('client/app', () => requestAnimationFrame(init) );
}

console.log('loaded!');
init();