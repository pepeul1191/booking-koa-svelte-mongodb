<script>
import { onMount } from 'svelte';
import { Router, Route, useLocation } from 'svelte-routing';
import Navbar from '../widgets/Navbar.svelte';
import Home from '../pages/app/Home.svelte';
import { getSession } from '../../services/user_service.js';
import { dataStore } from '../../stores/session_stores.js';

export let basepath = '/';

const location = window.location.pathname;
console.log(location)

onMount(() => {
  getSession().then((resp) => {
    console.log(resp)
    dataStore.set(resp.data.jwt);
    console.log(dataStore)
  }).catch((resp) =>  {
    console.error(resp.status)
    console.error(resp)
  })
});
</script>

<style>
</style>

<Navbar />
<main class="content px-3 py-2">
  <div class="container-fluid">
    <Router basepath="{basepath}">
      <Route path="/" component={Home} />
    </Router>
  </div>
</main>

