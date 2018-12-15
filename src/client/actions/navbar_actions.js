export const NAVBAR = 'NAVBAR';

export const renderNavbar = function (navbar) {
  return {
    type: NAVBAR,
    payload: navbar,
  };
};
