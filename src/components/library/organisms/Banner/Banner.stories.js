/* eslint-disable css-modules/no-unused-class */
import React from 'react';
import Banner from 'components/library/organisms/Banner/Banner';
import { data } from './storiesData';

export default {
  title: 'Organisms/Banner',
  component: Banner,
  parameters: {},
};

export const Default = {
  args: {
    ...data.default,
  },
  render: (args) => <Banner {...args} />,
};

export const Test = {
  args: {
    type: 'about_v3',
    data: {
      image: {
        path: '',
      },

      video: {
        autoPlay: false,
        inLoop: false,
      },

      title: {
        text: 'About Money Matters & More',
      },

      denmark: {
        msid: 115244096,
        hostId: 83,
      },

      content: {
        text: '',
      },

      ad: {
        type: 'mrec',
      },
    },
    layout: {
      components: {
        background: {
          isVisible: true,
        },

        leftContent: {
          isVisible: true,

          title: {
            isVisible: true,
            sectionLayout: 'h1',
            class: 'heading1 font24 transform-none left ',
          },

          sub_title: {
            isVisible: true,
            sectionLayout: 'h3',
          },

          description: {
            isVisible: true,
            sectionLayout: 'h5',
          },

          content: {
            isVisible: false,
            sectionLayout: 'normal',
          },

          denmark: {
            isVisible: true,
          },

          ctaBtn: {
            isVisible: true,
          },
        },

        rightContent: {
          isVisible: true,

          content: {
            wrapContent: true,
            type: 'ad',
            position: 'right',
          },
        },
      },

      id: 'about ',
    },
    config: {},
  },
  render: (args) => <Banner {...args} />,
};
