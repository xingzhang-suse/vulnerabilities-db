// src/router.js
import { captitalize } from './infra/utils/common.js';

export class Router {

  constructor(routes, options) {
    this.routes = routes;
    this.FILTER_AVAILABLE_PATHS = options.FILTER_AVAILABLE_PATHS;
  }

  init(containerSelector) {
    const container = document.querySelector(containerSelector);
    console.log(containerSelector)
    if (containerSelector !== '#main') {
      this.loadFrame(containerSelector.substring(1), container);
    } else {
      window.addEventListener('hashchange', this.handleRouteChange.bind(this, container));
      this.handleRouteChange(container);
    }
  }

  handleRouteChange(container) {
    const hashPath = window.location.hash.substr(2) || '/';
    const deserializedHashPath = hashPath.split('/');
    const path = `/${deserializedHashPath[0]}`;
    const params = deserializedHashPath.slice(1);
    const route = this.routes.find(r => r.path === path);

    if (route) {
      this.loadView(route.componentName, container, params);
    } else {
      console.error(`Route ${path} not found`);
    }
  }

  async loadFrame(frameName, container, params) {
    this.loadComponent(frameName, container, 'frame', params);
  }

  async loadView(viewName, container, params) {
    this.loadComponent(viewName, container, 'components', params);
  }

  async loadComponent(componentName, container, directory, params) {
    const module = await import(`./${directory}/${componentName}/${componentName}.js`);
    const Component = module[captitalize(componentName)];
    const componentInstance = new Component();
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(await componentInstance.render());
    componentInstance.init(params);
  }
}
