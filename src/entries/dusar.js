// src/entries/dusar.js
import '../stylesheets/dusar.css';
import '../stylesheets/styles.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dusar from '../components/layouts/Dusar.svelte';

const app = new Dusar({
  target: document.body,
  props: {
    name: 'world'
  }
});

export default app;