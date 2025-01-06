# Developer Guidelines:

1. install node  v18.19.1 [If not present]
2. install yarn [IF not present]


## StoryBook /Components Development
1. Run yarn install
2. yarn run storybook
go to - http://localhost:6006/


## All the stories file must have   .stories.js in name at the end
## Better to keep stories file in corresponding coponent folder

##  .storyBook Folder consist 

-- main.js:
Configures Storybook: Specifies where to find stories, includes addons, and can customize Webpack configuration.
Main entry point: This is where the core of your Storybook is defined.

-- preview.js:
Renders stories: Controls how stories are displayed and provides global configurations like decorators and parameters.
Styles and themes: You can import global styles and themes that apply to all stories, ensuring consistency across your components.

-- How They Work Together
When you start Storybook, it first processes the main.js configuration to know which stories to load and which addons to use.
It then uses the preview.js configuration to determine how to render those stories and apply any global decorators or parameters.
This separation allows for a clean and organized way to manage Storybook's configuration, making it easier to maintain and extend your Storybook setup as your project evolves.
