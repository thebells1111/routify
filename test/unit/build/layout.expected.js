
/**
 * @sveltech/routify 1.0.3
 * File generated Mon Mar 02 2020 03:33:06 GMT+0100 (Central European Standard Time)
 */

//buildRoutes
import { buildRoutes } from "/home/eric/projects/routify/routify/runtime/buildRoutes"

//dynamic imports
import __layout from '/pages/_layout.svelte'
import _index from '/pages/index.svelte'

//keys
const keys = ["isFallback","isIndex","hasParam","path","component","layouts","meta","shortPath"]

//layouts
const layouts = {
  "/_layout": {
    "component": () => __layout,
    "meta": {},
    "relativeDir": "",
    "path": ""
  }
}


//raw routes
const _routes = [
  {
    "component": () => _index,
    "meta": {},
    "isIndex": true,
    "isFallback": false,
    "hasParam": false,
    "path": "/index",
    "shortPath": "",
    "layouts": [
      layouts['/_layout']
    ]
  }
]

//options
export const options = {}

//routes
export const routes = buildRoutes(_routes, keys)
