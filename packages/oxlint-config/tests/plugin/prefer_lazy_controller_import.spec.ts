import preferLazyControllerImport from '../../src/plugin/rules/prefer_lazy_controller_import'
import { runRule } from './create_rule_tester'

runRule('prefer-lazy-controller-import', preferLazyControllerImport, {
  valid: [
    {
      name: 'Lazy import',
      code: `
        import router from "@adonisjs/core/services/router"
        const lazyController = () => import("./controller")

        router.get("/", "HomeController.index")
        router.get("/test", [lazyController, 'index'])
      `,
    },
    {
      name: 'Lazy import with middleware',
      code: `
        import router from "@adonisjs/core/services/router"
        import middleware from '#start/middleware'

        const lazyController = () => import("./controller")

        router.get("/", "HomeController.index").middleware(middleware.auth())
        router.get("/test", [lazyController, 'index']).middleware(middleware.auth())
      `,
    },
  ],
  invalid: [
    {
      name: 'Import expression',
      code: `
        import router from "@adonisjs/core/services/router"
        import HomeController from "./controller"

        router.group(() => {
          router.get("/", [HomeController, 'index'])
        })
      `,
      output: `
        import router from "@adonisjs/core/services/router"
        const HomeController = () => import("./controller")

        router.group(() => {
          router.get("/", [HomeController, 'index'])
        })
      `,
      errors: [{ messageId: 'preferLazyControllerImport' }],
    },
    {
      name: 'Import expression with resource',
      code: `
        import router from "@adonisjs/core/services/router"
        import ProjectThreadsController from "./controller"

        router.resource("project/:id/threads", ProjectThreadsController)
      `,
      output: `
        import router from "@adonisjs/core/services/router"
        const ProjectThreadsController = () => import("./controller")

        router.resource("project/:id/threads", ProjectThreadsController)
      `,
      errors: [{ messageId: 'preferLazyControllerImport' }],
    },
  ],
})
