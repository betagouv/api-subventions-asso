import App from './App.svelte';
import * as CONFIG from '../src/shared/config';

console.log({CONFIG});

export const auth = new App({ target: document.getElementById("svelte-body") });

