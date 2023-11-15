import { observer } from "mobx-react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Task from "taskarian";
import Store from "../../store";
import "./card.styles.css";

interface Props {
  card: any;
  index: number;
  store: Store;
}

const getCardStyle = (isDragging: any, draggableStyle: any) => {
  if (isDragging && draggableStyle.transform !== null)
    draggableStyle.transform += " rotate(3deg)";
  return { ...draggableStyle };
};

const handleDelete =
  (store: Store, cardId: string) =>
  (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    store.delete(cardId);
    Task.fromPromise(() => store.db.deleteCardById(cardId)).fork(
      (err) => console.log(err),
      (success) => console.log(success)
    );
  };

const Card: React.FC<Props> = ({ card, index, store }) => (
  <Draggable draggableId={card.id} index={index}>
    {(provided, snapshot) => (
      <div
        className="card"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        id={card.id}
        style={getCardStyle(snapshot.isDragging, provided.draggableProps.style)}
      >
        {card.description}
        <button onClick={handleDelete(store, card.id)} className="delete">
          &#10005;
        </button>
      </div>
    )}
  </Draggable>
);

export default observer(Card);
