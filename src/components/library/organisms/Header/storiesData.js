
/* eslint-disable import/prefer-default-export */
export const data = {
  default: {
    type: 'header_v3',
    config: {
      layout: {
        components: {
          back_to_button: {
            isVisible: true,
            class: 'light-pink-bg ',
          },
          logo: {
            isVisible: true,
          },
          navMenu: {
            isVisible: false,
          },
        },
      },
    }, 
    data: {
      background: {
        data:{
          colors: ['grey', 'green'],
          image: '',
        },
        config:{
          layout:{
            angle: '45deg'
          }
        }
      },
      navMenu: {
        data: {
          navItems: [
            {
              text: 'Home',
              link: '#',
              isActive: true,
            },
            {
              text: 'Partners',
              link: '#partners',
            },
            {
              text: 'Articles',
              link: '#articles',
            },
          ],
          activeNav: 'Home',
        },
        config:{

        }
      },
      socialIcons: {
        items: [],
      },
      back_to_button: {
        data:{
          channel: 'TOI',
        }
      },
      logo: {
        data: {
          src: 'https://static.toiimg.com/photo/114077794.cms ',
          link: 'https://www.airnewzealand.com.sg/flight-deals-to-new-zealand-from-india/?utm_source=timesofindia&utm_medium=display&utm_campaign=brand-IN-CAG-JV-202409&utm_content=awareness-advertorial&dclid=CIjjqfv27IgDFW8GgwMdNYIYLg',
        }        
      },
    },
  },
};
