export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';

export const openDrawer = function (drawer) {
  return {
    type: OPEN_DRAWER,
    payload: drawer,
  };
};

export const closeDrawer = function () {
  return {
    type: CLOSE_DRAWER,
  };
};