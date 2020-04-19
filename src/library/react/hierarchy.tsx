import React from 'react';

import { Container, Graphics } from 'pixi.js';
import { Entity } from '../entity';
import { Debug } from '../debug';
import { IGameState } from 'Library';
import { NormalFlower } from '../../game/normal_flower';
import { DebugFlags } from '../../game/debug';

type HierarchyProps = { 
  root       : Entity | Container;
  setSelected: (obj: Entity | Container) => void;
  setMoused  : (obj: Entity | Container | null) => void;
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
      this.hoverGraphics = Debug.DrawBounds(this.props.root, 0xff0000, true, "stage");

      if (this.props.root instanceof Entity) {
        this.hoverGraphics = [
          ...this.hoverGraphics,
          Debug.DrawPoint(this.props.root.position, 0xff0000, true),
        ];
      }
    }
  };

  mouseOver = () => {
    this.setState({ hover: true })

    if (this.props.root instanceof Entity) {
      this.oldTint[this.props.root.id] = this.props.root.sprite.tint;

      this.props.root.sprite.tint = 0x000099;
    }

    this.hoverTarget = this.props.root;
    this.props.setMoused(this.props.root);
  };

  mouseOut = () => {
    this.setState({ hover: false })

    if (this.props.root instanceof Entity) {
      this.props.root.sprite.tint = this.oldTint[this.props.root.id];
    }

    this.hoverTarget = null;
    this.props.setMoused(null);
  };

  click = () => {
    this.props.setSelected(this.props.root);

    console.log(this.props.root);
  };

  renderLeaf(root: any) {
    if (!DebugFlags["Show Flowers in Hierarchy"] && root instanceof NormalFlower) { return null };

    return (<div>
      { root.name } (depth: { root.zIndex }) { root instanceof Entity && (
          root.activeModes.includes(this.props.gameState.mode) ? "Active" : "Inactive"
      )}
    </div>)
  }

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
          
          {this.renderLeaf(root)}
          
        </div>
        {
          root instanceof Entity &&
          root.children().length > 0 && root.children().length < 500 &&
            root.children().map(child => {
              return <Hierarchy setMoused={this.props.setMoused} setSelected={this.props.setSelected } root={ child } gameState={ this.props.gameState } />
            })
        }

        {
          root instanceof Entity &&
          root.children().length > 500 &&
            <div>
              A lot of children
            </div>
        }
      </div>
    )
  };
}
