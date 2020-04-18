import React from 'react';
import ReactDOM from 'react-dom';

import { BaseGame } from '../base_game';
import { Hierarchy } from './hierarchy';
import { DebugFlagButtons, DebugFlagsType } from './debug_flag_buttons';
import { IS_DEBUG } from '../environment';
import { Entity } from '../entity';
import { Container } from 'pixi.js';

type ReactWrapperProps = {
  game      : BaseGame<{}>;
  debugFlags: DebugFlagsType;
};

type ReactWrapperState = {
  selected: Entity | Container | null;
  moused: Entity | Container | null;
};

export class GameReactWrapper extends React.Component<ReactWrapperProps, ReactWrapperState> {
  static Instance: GameReactWrapper;
  mounted = false;

  constructor(props: ReactWrapperProps) {
    super(props);

    this.state = { 
      selected: this.props.game.stage,
      moused  : null,
    };

    setInterval(() => this.monitorHierarchyUpdates(), 50);
  }

  componentDidMount() {
    this.mounted = true;
    GameReactWrapper.Instance = this;
  }

  componentWillUnmount() {
    console.error("This should never happen!!!! very bad?!?");
  }

  monitorHierarchyUpdates = () => {
    if (this.mounted) {
      this.forceUpdate();
    }
  };

  setSelected = (obj: Entity | Container) => {
    this.setState({
      selected: obj,
    });
  };

  setMoused = (obj: Entity | Container | null) => {
    this.setState({
      moused: obj,
    });
  };


  renderSelected = () => {
    const target = this.state.moused || this.state.selected;

    if (target === null) { return null; }

    if (target instanceof Container) {
      return (
        <div style={{ fontWeight: 600, fontFamily: 'arial', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px' }}>Stage</div>
      );
    }

    return (
      <div>
        <div style={{ fontWeight: 600, fontFamily: 'arial', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px' }}>{ target.name }</div>
        <div>
          x: { target.x }, y: { target.y }
        </div>
        <div>
          width: { target.width }, height: { target.height }
        </div>
        <div>
          visible: { target.visible ? "true" : "false" }
        </div>
      </div>
    );
  };

  render() {
    return (
      <div style={{
        display: "flex",
        flexDirection: "row",
        borderLeft: "1px solid lightgray",
        marginLeft: '16px',
        paddingLeft: '8px',
      }}>
        <div style={{
          overflow: "auto",
          height: "90vh",
          fontFamily: 'arial',
          fontSize: '14px',
        }}>
          { this.props.game && this.props.game.stage && IS_DEBUG &&
            <div style={{ paddingLeft: '8px', }}>
              <div style={{ fontFamily: "arial", marginBottom: '8px', fontSize: '14px', width: '300px', backgroundColor: '#eee', padding: '8px' }}>
                Note: This debugging panel is only shown in development, or production with ?debug=true.
              </div>
              <div style={{ fontWeight: 600, fontFamily: 'arial', paddingBottom: '8px', fontSize: '18px' }}>Debug Options</div>
              <DebugFlagButtons flags={ this.props.debugFlags } />

              { this.renderSelected() }

              <div style={{ fontWeight: 600, fontFamily: 'arial', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px' }}>Debug Hierarchy</div>
              <Hierarchy setMoused={ this.setMoused } setSelected={ this.setSelected } root={this.props.game.stage} gameState={this.props.game.state} />
              <Hierarchy setMoused={ this.setMoused } setSelected={ this.setSelected } root={this.props.game.fixedCameraStage}  gameState={this.props.game.state} />
            </div> 
          }
        </div>
      </div>
    );
  }
}

export const CreateGame = (game: BaseGame<any>, debugFlags: DebugFlagsType) => {
  ReactDOM.render(
    <React.StrictMode>
      <GameReactWrapper
        game={ game }
        debugFlags={ debugFlags }
      />
    </React.StrictMode>,
    document.getElementById('root')
  );
}