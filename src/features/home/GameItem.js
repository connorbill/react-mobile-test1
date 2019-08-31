import React, { Component } from 'react';

export class GameItem extends Component {
  render() {
    return (
      <li>
        <p className="flag">广东</p>
        <p className="lottery-ball"></p>
        <p className="hot-text">广东三十分</p>
        <p>
          11:12:12:13
        </p>
        <p className="online">在线100人</p>
      </li>
    )
  }
}
