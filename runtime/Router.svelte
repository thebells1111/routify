<script>
  import { setContext } from 'svelte'
  import Route from './Route.svelte'
  import { init } from './navigator.js'
  import { routes as routesStore } from './store.js'
  import { suppressWarnings } from './utils.js'

  window.routify = {}
  suppressWarnings()

  export let routes
  routesStore.set(routes)
  let layouts = []

  const callback = res => (layouts = res)
  $: updatePage = init($routesStore, callback)
  $: updatePage()
  $: setContext('routifyupdatepage', updatePage)
</script>

<Route {layouts} />
