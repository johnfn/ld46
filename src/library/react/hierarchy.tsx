import React from 'react';

import { Container, Graphics } from 'pixi.js';
import { Entity } from '../entity';
import { Debug } from '../debug';
import { IGameState } from 'Library';

type HierarchyProps = { 
  root       : Entity | Container;
  setSelected: (obj: Entity | Container) => void;
  gameState  : IGameState;
};

export class Hierarchy extends React.Component<HierarchyProps, { hover: boolean }> {
  constructor(props: HierarchyProps) {
    super(props);

    this.state = {
      hover: false,
    };

    setInterval(() => {
      this.updateDebugGraphics();
    }, 50);
  }

  oldTint: { [key: number]: number } = {};

  hoverGraphics: Graphics[] = [];
  hoverTarget: Entity | Container | null = null;

  updateDebugGraphics = () => {
    // clear debug graphics

    for (const graphic of this.hoverGraphics) {
      graphic.parent.removeChild(graphic);
      graphic.destroy();
    }

    this.hoverGraphics = [];

    if (this.hoverTarget !== null) {
      this.hoverGraphics = Debug.DrawBounds(this.props.root, 0xff0000, true);
    }
  };

  mouseOver = () => {
    this.setState({ hover: true })

    if (this.props.root instanceof Entity) {
      this.oldTint[this.props.root.id] = this.props.root.sprite.tint;

      this.props.root.sprite.tint = 0x000099;
    }

    this.hoverTarget = this.props.root;
  };

  mouseOut = () => {
    this.setState({ hover: false })

    if (this.props.root instanceof Entity) {
      this.props.root.sprite.tint = this.oldTint[this.props.root.id];
    }

    this.hoverTarget = null;
  };

  click = () => {
    this.props.setSelected(this.props.root);

    console.log(this.props.root);
  };

  render() {
    const root = this.props.root;

    return (
      <div 
        style={{ 
          paddingLeft: "10px", 
          fontFamily: 'Arial',
          fontSize: '14px',
          backgroundColor: this.state.hover ? "#eee" : "#fff" 
        }}
      >
        <div
          onMouseEnter={this.mouseOver}
          onMouseLeave={this.mouseOut}
          onClick={this.click}
        >
          <div>
            { root.name } (depth: { root.zIndex }) { root instanceof Entity && (
                root.activeModes.includes(this.props.gameState.mode) ? "Active" : "Inactive"
            )}
          </div>
        </div>
        {
          root instanceof Entity &&
          root.children().length > 0 &&
            root.children().map(child => {
              return <Hierarchy setSelected={this.props.setSelected } root={ child } gameState={ this.props.gameState } />
            })
        }
      </div>
    )
  };
}
