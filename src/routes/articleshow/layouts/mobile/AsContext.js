// import { createContext, useContext, useReducer } from 'react';

// const GlobalContext = createContext(null);

// const GlobalDispatchContext = createContext(null);

// export function TasksProvider({ children, routeData }) {
//   const [tasks, dispatch] = useReducer(tasksReducer);

//   return (
//     <TasksContext.Provider value={tasks}>
//       <TasksDispatchContext.Provider value={dispatch}>
//         {children}
//       </TasksDispatchContext.Provider>
//     </TasksContext.Provider>
//   );
// }

// export function useTasks() {
//   return useContext(TasksContext);
// }

// export function useTasksDispatch() {
//   return useContext(TasksDispatchContext);
// }

// function tasksReducer(tasks, action) {
//   switch (action.type) {
//     case 'added': {
//       return [
//         ...tasks,
//         {
//           id: action.id,
//           text: action.text,
//           done: false,
//         },
//       ];
//     }
//     case 'changed': {
//       return tasks.map((t) => {
//         if (t.id === action.task.id) {
//           return action.task;
//         } else {
//           return t;
//         }
//       });
//     }
//     case 'deleted': {
//       return tasks.filter((t) => t.id !== action.id);
//     }
//     default: {
//       throw Error('Unknown action: ' + action.type);
//     }
//   }
// }

// const initialTasks = routeData
