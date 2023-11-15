import { action, computed, observable } from "mobx";
import { just, Maybe, nothing } from "maybeasy";
import { Card, CardType, error, loading, ready, State, waiting } from "./Types";

export const assertNever = (x: never) => {
  throw new Error(`Unexpected object: ${x}`);
};

class Store {
  @observable
  state: State = waiting();

  @action
  load = () => {
    switch (this.state.kind) {
      case "waiting":
        this.state = loading(this.state);
        break;
      case "ready":
      case "loading":
      case "error":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  ready = (data: any) => {
    switch (this.state.kind) {
      case "ready":
      case "error":
      case "waiting":
        break;
      case "loading":
        this.state.db = data.db;
        this.state = ready(this.state);
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  error = (err: any) => {
    this.state = error(
      `Request failed due to '${err.kind}'. Please try again later.`
    );
  };

  @action
  setCreateString = (string: string) => {
    switch (this.state.kind) {
      case "ready":
        this.state.createString = string;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  toggleModal = (isOpen: boolean) => {
    switch (this.state.kind) {
      case "ready":
        this.state.open = isOpen;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  setStatus = (status: CardType) => {
    switch (this.state.kind) {
      case "ready":
        this.state.status = status;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  addCard = (card: Card) => {
    switch (this.state.kind) {
      case "ready":
        switch (card.status) {
          case "TODO":
            this.state.todo = [...this.state.todo, card].flat();
            break;
          case "IN_PROGRESS":
            this.state.inProgress = [...this.state.inProgress, card].flat();
            break;
          case "DONE":
            this.state.done = [...this.state.done, card].flat();
            break;
        }
        this.state.open = false;
        this.state.createString = "";
        this.state.status = "";
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  setTodo = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.todo = cards;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  setInProgress = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.inProgress = cards;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  setDone = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.done = cards;
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  setCards = (cards: Array<Card>) => {
    switch (this.state.kind) {
      case "ready":
        this.state.todo = cards.filter((card: Card) => card.status === "TODO");
        this.state.inProgress = cards.filter(
          (card: Card) => card.status === "IN_PROGRESS"
        );
        this.state.done = cards.filter((card: Card) => card.status === "DONE");
        this.state.open = false;
        this.state.createString = "";
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @action
  delete = (cardId: string) => {
    switch (this.state.kind) {
      case "ready":
        this.state.todo = this.state.todo.filter(
          (card: Card) => card.id !== cardId
        );
        this.state.inProgress = this.state.inProgress.filter(
          (card: Card) => card.id !== cardId
        );
        this.state.done = this.state.done.filter(
          (card: Card) => card.id !== cardId
        );
        break;
      case "error":
      case "waiting":
      case "loading":
        break;
      default:
        assertNever(this.state);
    }
  };

  @computed
  get createString(): Maybe<string> {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return just(this.state.createString);
      case "waiting":
      case "error":
      default:
        return nothing();
    }
  }

  @computed
  get status(): CardType {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return this.state.status;
      case "waiting":
      case "error":
      default:
        return "";
    }
  }

  @computed
  get modalOpen(): boolean {
    switch (this.state.kind) {
      case "ready":
      case "loading":
        return this.state.open;
      case "waiting":
      case "error":
      default:
        return false;
    }
  }

  @computed
  get errorMessage(): Maybe<string> {
    switch (this.state.kind) {
      case "error":
        return just(this.state.message);
      case "ready":
      case "loading":
      case "waiting":
      default:
        return nothing();
    }
  }

  @computed
  get todo(): Array<Card> {
    switch (this.state.kind) {
      case "ready":
        return this.state.todo;
      case "error":
      case "loading":
      case "waiting":
      default:
        return [];
    }
  }

  @computed
  get inProgress(): Array<Card> {
    switch (this.state.kind) {
      case "ready":
        return this.state.inProgress;
      case "error":
      case "loading":
      case "waiting":
      default:
        return [];
    }
  }

  @computed
  get done(): Array<Card> {
    switch (this.state.kind) {
      case "ready":
        return this.state.done;
      case "error":
      case "loading":
      case "waiting":
      default:
        return [];
    }
  }

  @computed
  get db(): any {
    switch (this.state.kind) {
      case "ready":
        return this.state.db;
      case "loading":
      case "waiting":
      case "error":
      default:
        return false;
    }
  }
}

export default Store;
