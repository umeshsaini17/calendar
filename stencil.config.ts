import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'te-calendar',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  copy: [
      {
          src: 'index.html',
          dest: 'index.html'
      }
  ]
};
