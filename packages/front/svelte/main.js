import axios from "axios";
import { DATASUB_URL } from "../src/shared/config";
import App from './App.svelte';

axios.defaults.baseURL = DATASUB_URL;

export const auth = new App({ target: document.getElementById("svelte-body") });

