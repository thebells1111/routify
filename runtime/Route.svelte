<script>
  import { getContext, setContext, onDestroy, onMount, tick } from 'svelte'
  import { writable } from 'svelte/store'
  import { _url, _goto, _isActive } from './helpers.js'
  import { route, routes } from './store'
  import { handleScroll } from './utils'

  export let layouts = [],
    scoped = {},
    Decorator = undefined,
    _passthroughDecorator = undefined
  let scopeToChild,
    props = {},
    parentElement,
    propFromParam = {},
    key = 0,
    scopedSync = {}

  const context = writable({})
  setContext('routify', context)

  $: if (Decorator) {
    layouts = [
      { component: () => Decorator, path: layouts[0].path + '__decorator' },
      ...layouts,
    ]
  }

  $: [layout, ...remainingLayouts] = layouts
  $: if (layout && layout.param) propFromParam = layout.param
  $: layoutIsUpdated = !_lastLayout || _lastLayout.path !== layout.path

  function setParent(el) {
    parentElement = el.parentElement
  }

  let _lastLayout, _Component
  function onComponentLoaded() {
    _lastLayout = layout
    if (layoutIsUpdated) key++
    if (remainingLayouts.length === 0) onLastComponentLoaded()
    const url = _url(layout, $route, $routes)
    context.set({
      route: $route,
      path: layout.path,
      url,
      goto: _goto(url),
      isActive: _isActive(url, $route),
    })
  }

  let component
  function setComponent(layout) {
    if (layoutIsUpdated) _Component = layout.component()
    if (_Component.then)
      _Component.then(res => {
        component = res
        scopedSync = { ...scoped }
        onComponentLoaded()
      })
    else {
      component = _Component
      scopedSync = { ...scoped }
      onComponentLoaded()
    }
  }
  $: setComponent(layout)

  async function onLastComponentLoaded() {
    await tick()
    handleScroll(parentElement)
    if (!window.routify.stopAutoReady) {
      // Let every know the last child has rendered
      dispatchEvent(new CustomEvent('app-loaded'))
    }
  }
</script>

{#if component}
  {#each [0] as dummy (key)}
    <svelte:component
      this={component}
      let:scoped={scopeToChild}
      let:decorator
      {scoped}
      {scopedSync}
      {...propFromParam}>
      {#if remainingLayouts.length}
        <svelte:self
          layouts={[...remainingLayouts]}
          Decorator={typeof decorator !== 'undefined' ? decorator : _passthroughDecorator}
          _passthroughDecorator={Decorator}
          scoped={{ ...scoped, ...scopeToChild }} />
      {/if}
    </svelte:component>
  {/each}
{/if}

<!-- get the parent element for scroll functionality -->
{#if !parentElement}
  <span use:setParent />
{/if}
