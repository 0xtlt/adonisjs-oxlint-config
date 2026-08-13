import namingConvention from './rules/naming_convention'
import noBackendImportInFrontend from './rules/no_backend_import_in_frontend'
import noForLoop from './rules/no_for_loop'
import noUndefInit from './rules/no_undef_init'
import preferAdonisjsInertiaForm from './rules/prefer_adonisjs_inertia_form'
import preferAdonisjsInertiaLink from './rules/prefer_adonisjs_inertia_link'
import preferLazyControllerImport from './rules/prefer_lazy_controller_import'
import preferLazyListenerImport from './rules/prefer_lazy_listener_import'
import type { Plugin } from './types'

const plugin: Plugin = {
  meta: {
    name: '@adonisjs',
  },
  rules: {
    'prefer-lazy-controller-import': preferLazyControllerImport,
    'prefer-lazy-listener-import': preferLazyListenerImport,
    'prefer-adonisjs-inertia-link': preferAdonisjsInertiaLink,
    'prefer-adonisjs-inertia-form': preferAdonisjsInertiaForm,
    'no-backend-import-in-frontend': noBackendImportInFrontend,
    'no-undef-init': noUndefInit,
    'no-for-loop': noForLoop,
    'naming-convention': namingConvention,
  },
}

export default plugin
export {
  namingConvention,
  noBackendImportInFrontend,
  noForLoop,
  noUndefInit,
  preferAdonisjsInertiaForm,
  preferAdonisjsInertiaLink,
  preferLazyControllerImport,
  preferLazyListenerImport,
}
