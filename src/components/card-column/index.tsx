import * as React from "react";
import "./card-column.styles.css";
import { Droppable } from "react-beautiful-dnd";
import Card from "../card";
import { observer } from "mobx-react";
import Store from "../../store";

interface Props {
  cards: Array<any>;
  status: string;
  store: Store
}

const CardColumn: React.FC<Props> = ({ cards, status, store }) => (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        className="card-column"
        {...provided.droppableProps}
      >
        {cards.map((card, index) => {
          return <Card card={card} index={index} key={card.id} store={store} />;
        })}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default observer(CardColumn);
