import React from 'react';

const pageName = 'articleshow_desktop';

async function action() {
  try {
    const status = 404;
    const redirect = false;
    return {
      chunks: [pageName],
      title: '',
      maxAge: '',
      status,
      component: <div>Page Not Found</div>,
      redirect,
    };
  } catch (err) {
    console.log('dsktop As', err);
    return {};
  }
}

export default action;
