/* eslint-disable import/prefer-default-export */
export const data = {
    default: {
      type: 'about',
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
        api:{
          dataUrl: ''
        },
        content: {
          text: '',
        },
        ad: {
          type: 'mrec',
        },
      },
      config:{
        layout: {
            layout: 'layout1',
            components: {
              background: {
                isVisible: true,
              },
              textContent: {
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
                fromApi: {
                  isVisible: true,
                },
                ctaBtn: {
                  isVisible: true,
                },
              },
              mediaContent: {
                isVisible: true,
                content: {
                  type: 'ad',
                },
              },
            },
            id: 'about',
          },
        }
      }
      
}


