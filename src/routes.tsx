import CharacterList from './screens/CharacterList';
import CharacterDetail from './screens/CharacterDetail';
import { createRouter, RootRoute, Route } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';

const rootRoute = new RootRoute({
  component: () => <div><Outlet /></div>,
});

const charactersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/character',
  component: CharacterList,
});

export const characterDetailsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/character/$id',
  component: CharacterDetail,
});


// @ts-ignore
const routeTree = rootRoute.addChildren([
  charactersRoute,
  characterDetailsRoute,
]);

export const router = createRouter({ routeTree });
