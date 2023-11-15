import React from "react";
import "./card-columns.styles.css";
import { observer } from "mobx-react";
import { Maybe } from "maybeasy";
import CardColumn from "../card-column";
import CreateCard from "../create-card";
import { DragDropContext } from "react-beautiful-dnd";
import Store from "../../store";
import Task from "taskarian";

interface Props {
  store: Store;
  createString: Maybe<string>;
}

const getCards = (column: string, store: Store): Array<any> => {
  switch (column) {
    case "TODO":
      return Array.from(store.todo);
    case "IN_PROGRESS":
      return Array.from(store.inProgress);
    case "DONE":
      return Array.from(store.done);
    default:
      return [];
  }
};

const setCards = (column: string, cards: Array<any>, store: Store) => {
  switch (column) {
    case "TODO":
      return store.setTodo(cards);
    case "IN_PROGRESS":
      return store.setInProgress(cards);
    case "DONE":
      return store.setDone(cards);
  }
};

const onDragEnd = (store: Store) => (result: any) => {
  const { destination, source } = result;
  if (!destination) {
    return;
  }
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  const column = source.droppableId;
  let cards = getCards(column, store);

  if (destination.droppableId === source.droppableId) {
    // // Database does not keep track of index so it just updates this on the front end
    const card = cards.splice(source.index, 1);
    cards.splice(destination.index, 0, ...card);
    setCards(column, cards, store);
  }

  if (destination.droppableId !== source.droppableId) {
    const card = cards[source.index];
    card.status = destination.droppableId;
    cards.splice(source.index, 1);
    const destinationCards = getCards(destination.droppableId, store);
    destinationCards.splice(destination.index, 0, card);
    setCards(destination.droppableId, destinationCards, store);
    setCards(column, cards, store);
    Task.fromPromise(() =>
      store.db.updateCardById(card.id, { status: destination.droppableId })
    ).fork(
      (err) => console.log(err),
      (success) => console.log(success)
    );
  }
};

const CardColumns: React.FC<Props> = ({ store, createString }) => {
  return (
    <div className="App">
      <div className="columns-container">
        <DragDropContext onDragEnd={onDragEnd(store)}>
          <div className="column-container">
            <h1 className="column-title">To-do</h1>
            <CardColumn cards={store.todo} status="TODO" store={store} />
          </div>
          <div className="column-container">
            <h1 className="column-title">In Progress</h1>
            <CardColumn
              cards={store.inProgress}
              status="IN_PROGRESS"
              store={store}
            />
          </div>
          <div className="column-container">
            <h1 className="column-title">Done</h1>
            <CardColumn cards={store.done} status="DONE" store={store} />
          </div>
          <CreateCard store={store} createString={createString} />
        </DragDropContext>
      </div>
    </div>
  );
};

export default observer(CardColumns);
