const routes = [
  { path: '/', componentName: 'home' },
  { path: '/admin', componentName: 'admin' },
  { path: '/no-fix', componentName: 'nofix' },
  { path: '/detail', componentName: 'detail' },
  { path: '/feed', componentName: 'feed' },
  { path: '/package', componentName: 'package' },
];


const FILTER_AVAILABLE_PATHS = [
  '/',
  '/no-fix'
];

module.exports = {
  routes,
  FILTER_AVAILABLE_PATHS
};
