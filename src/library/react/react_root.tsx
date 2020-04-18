import React from 'react';
import ReactDOM from 'react-dom';

import { BaseGame } from '../base_game';
import { Hierarchy } from './hierarchy';
import { DebugFlagButtons, DebugFlagsType } from './debug_flag_buttons';
import { IS_DEBUG } from '../environment';

type ReactWrapperProps = {
  game      : BaseGame<{}>;
  debugFlags: DebugFlagsType;
};

type ReactWrapperState = {
};

export class GameReactWrapper extends React.Component<ReactWrapperProps, ReactWrapperState> {
  static Instance: GameReactWrapper;
  mounted = false;

  constructor(props: ReactWrapperProps) {
    super(props);

    this.state = { 
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
              <div style={{ fontFamily: "arial", marginBottom: '8px', fontSize: '14px', width: '400px', backgroundColor: '#eee', padding: '8px' }}>
                Note: This debugging panel is only shown in development, or production with ?debug=true.
              </div>
              <div style={{ fontWeight: 600, fontFamily: 'arial', paddingBottom: '8px', fontSize: '18px' }}>Debug Options</div>
              <DebugFlagButtons flags={ this.props.debugFlags } />
              <div style={{ fontWeight: 600, fontFamily: 'arial', paddingTop: '8px', paddingBottom: '8px', fontSize: '18px' }}>Debug Hierarchy</div>
              <Hierarchy root={this.props.game.stage} />
              <Hierarchy root={this.props.game.fixedCameraStage} />
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