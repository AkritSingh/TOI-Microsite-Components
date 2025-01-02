function getRoutes(layout) {
  // The top-level (parent) route
  const routes = {
    path: '',
    // Keep in mind, routes are evaluated in order
    children: [
      // The home route is added to client.js to make sure shared components are
      // added to client.js as well and not repeated in individual each route chunk.
      {
        path: '(.*)/articleshow/:msid.cms', // redirect to liveblog as home not available.
        load: () =>
          import(
            /* webpackChunkName: 'articleshow_[request]' */ `./articleshow/layouts/${layout}`
          ),
      },
      {
        path: '(.*)',
        load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
      },
    ],

    async action({ next }) {
      // Execute each child route until one of them return the result
      const route = await next();
      // console.log("inside ACTION common");
      // Provide default values for title, description etc.
      route.title = `${route.title || ''}`;
      route.description = route.description || 'News ,Times of India';

      return route;
    },
  };

  return routes;
}

function routesNodes(globalContext, initialState) {
  const layout = initialState.isMobile ? 'mobile' : 'desktop';
  const routes = getRoutes(layout, globalContext, initialState);
  // The error page is available by permanent url for development mode
  if (__DEV__) {
    routes.children.unshift({
      path: '/error',
      // eslint-disable-next-line global-require
      action: require('./error').default,
    });
  }

  return routes;
}
export default routesNodes;
