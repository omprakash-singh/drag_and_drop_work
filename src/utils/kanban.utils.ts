import KanbanDB from "kanbandb";
import Task from "taskarian";

export const connectToKanbanDB = () => {
  return Task.fromPromise(() => KanbanDB.connect("testDB"));
};

export const getCards = (obj: any) => {
  return Task.fromPromise(() => obj.db.getCards());
};
