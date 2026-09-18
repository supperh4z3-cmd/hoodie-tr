export class Router {
  constructor(routes, mountElementId = 'app') {
    this.routes = routes;
    this.mountEl = document.getElementById(mountElementId);
    this.currentRoute = null;

    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('load', () => this.handleRouting());
  }

  handleRouting() {
    const rawHash = window.location.hash.slice(1) || 'home';
    const [path, queryString] = rawHash.split('?');
    const params = new URLSearchParams(queryString || '');

    // Check for dynamic product route: product/prod-01
    if (path.startsWith('product/')) {
      const productId = path.split('/')[1];
      this.renderRoute('product', { id: productId });
      this.updateActiveNav('shop');
      return;
    }

    // Standard routes
    const routeKey = path.toLowerCase();
    if (this.routes[routeKey]) {
      this.renderRoute(routeKey, { queryParams: params });
      this.updateActiveNav(routeKey);
    } else {
      this.renderRoute('home', {});
      this.updateActiveNav('home');
    }
  }

  renderRoute(routeKey, context) {
    if (!this.mountEl) {
      this.mountEl = document.getElementById('app');
    }
    if (!this.mountEl) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentRoute = routeKey;

    const handler = this.routes[routeKey];
    if (typeof handler === 'function') {
      this.mountEl.innerHTML = handler(context);
      
      // Trigger post-render lifecycle hook if defined
      const postMount = this.routes[`${routeKey}_mount`];
      if (typeof postMount === 'function') {
        postMount(context);
      }
    }
  }

  updateActiveNav(activeKey) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route === activeKey) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  navigate(hash) {
    window.location.hash = hash;
  }
}
