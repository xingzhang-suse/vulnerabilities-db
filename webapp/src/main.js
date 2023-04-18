import $ from 'jquery';
import Popper from '@popperjs/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/index.scss';
import { Router } from './router.js';
import { routes, FILTER_AVAILABLE_PATHS } from './routes.js';

const router = new Router(
  routes,
  {
    FILTER_AVAILABLE_PATHS
  }
);

router.init('#sidebar');
router.init('#main');
