export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  repeat?: string;
  daysOfWeek?: string[];
}

export interface List {
  id: string;
  title: string;
  name: string;
  items: Todo[];
}

type SetListFunction = (list: List) => void;
type SetItemNameFunction = (itemName: string) => void;
type SetIsAddingItemFunction = (isAdding: boolean) => void;
type SetIsEditingItemFunction = (isEditing: boolean) => void;
type SetCurrentTodoIdFunction = (id: string | null) => void;
type SetDueDateFunction = (date: Date) => void;
type SetRepeatFunction = (repeat: string) => void;
type SetDaysOfWeekFunction = (daysOfWeek: string[]) => void;
type SetSelectedRepeatTextFunction = (text: string) => void;
type SetSelectedDueDateTextFunction = (text: string) => void;

export const addItem = (
  list: List | null,
  itemName: string,
  sortItems: (items: Todo[]) => Todo[],
  setList: SetListFunction,
  saveList: (list: List) => void,
  setItemName: SetItemNameFunction,
  setIsAddingItem: SetIsAddingItemFunction,
  dueDate?: Date,
  repeat?: string,
  daysOfWeek?: string[]
) => {
  if (list && itemName.trim().length > 0) {
    const newItem: Todo = {
      id: Date.now().toString(),
      title: itemName,
      completed: false,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : undefined,
      repeat: repeat || "none",
      daysOfWeek: daysOfWeek || [],
    };

    const newItems = sortItems([...list.items, newItem]);
    const updatedList = { ...list, items: newItems };

    setList(updatedList);
    saveList(updatedList);
    setItemName("");
    setIsAddingItem(false);
  }
};

export const editTodoItem = (
  list: List | null,
  currentTodoId: string | null,
  itemName: string,
  sortItems: (items: Todo[]) => Todo[],
  setList: SetListFunction,
  saveList: (list: List) => void,
  setItemName: SetItemNameFunction,
  setIsEditingItem: SetIsEditingItemFunction,
  dueDate?: Date,
  repeat?: string,
  daysOfWeek?: string[]
) => {
  if (list && currentTodoId && itemName.trim().length > 0) {
    const newItems = sortItems(
      list.items.map((item) =>
        item.id === currentTodoId
          ? {
              ...item,
              title: itemName,
              dueDate: dueDate
                ? dueDate.toISOString().split("T")[0]
                : item.dueDate,
              repeat: repeat || item.repeat,
              daysOfWeek: daysOfWeek || item.daysOfWeek,
            }
          : item
      )
    );
    const updatedList = { ...list, items: newItems };
    setList(updatedList);
    saveList(updatedList);
    setItemName("");
    setIsEditingItem(false);
  }
};

export const startEditTodo = (
  id: string,
  title: string,
  dueDate: string,
  repeat: string,
  daysOfWeek: string[],
  setIsEditing: SetIsEditingItemFunction,
  setIsAdding: SetIsAddingItemFunction,
  setCurrentTodoId: SetCurrentTodoIdFunction,
  setItemName: SetItemNameFunction,
  setDueDate: SetDueDateFunction,
  setRepeat: SetRepeatFunction,
  setDaysOfWeek: SetDaysOfWeekFunction,
  setSelectedRepeatText: SetSelectedRepeatTextFunction,
  setSelectedDueDateText: SetSelectedDueDateTextFunction,
  daysMap: { [key: string]: string },
  formatDueDate: (dueDate: string) => string
) => {
  setIsEditing(true);
  setIsAdding(false);
  setCurrentTodoId(id);
  setItemName(title);
  setDueDate(new Date(dueDate));
  setRepeat(repeat);
  setDaysOfWeek(daysOfWeek);
  setSelectedRepeatText(
    repeat === "none" && daysOfWeek.length > 0
      ? `Specific days: ${daysOfWeek.map((day) => daysMap[day]).join(", ")}`
      : repeat === "none"
      ? "Unselected"
      : repeat
  );
  setSelectedDueDateText(
    dueDate === new Date().toISOString().split("T")[0]
      ? "Today"
      : formatDueDate(dueDate)
  );
};

export const sortItems = (items: Todo[]): Todo[] => {
  return items.sort((a, b) => Number(a.completed) - Number(b.completed));
};
