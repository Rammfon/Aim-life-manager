import React from "react";
import { registerRootComponent } from "expo";
import TodoApp from "../components/TodoApp";

const App: React.FC = () => {
  return <TodoApp />;
};

export default App;

// Register the main component
registerRootComponent(App);
