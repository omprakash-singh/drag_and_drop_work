import { comparer, IReactionDisposer, IReactionOptions, IReactionPublic, reaction } from 'mobx';
import * as React from 'react';

export interface ReactState {}

export interface RCProps<Store> {
  store: Store;
  fireImmediately?: boolean;
  debounceDelay?: number;
}

export type ReactionComparer<ObservedState> = (
  prev: ObservedState,
  current: ObservedState
) => boolean;

abstract class ReactionComponent<
  Store,
  ObservedState,
  P extends RCProps<Store>
> extends React.Component<P, ReactState> {
  protected abstract tester: (r?: IReactionPublic) => ObservedState;
  protected abstract effect: (arg: ObservedState, r?: IReactionPublic) => void;

  /**
   * Provides logic that determines if the watched value has changed. The default behavior
   * is to use mobx's default compare, which is a slighty enhanced identity compare.
   */
  protected comparer: ReactionComparer<ObservedState> = comparer.default;

  private running?: IReactionDisposer;

  private get options(): IReactionOptions | undefined {
    return {
      fireImmediately: this.props.fireImmediately,
      delay: this.props.debounceDelay,
      equals: this.comparer,
    };
  }

  constructor(props: P) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.running = this.run();
  }

  componentWillUnmount() {
    if (this.running) {
      this.running();
    }
  }

  render() {
    return <></>;
  }

  private run(): IReactionDisposer {
    return reaction(this.tester, this.effect, this.options);
  }
}

export default ReactionComponent;
