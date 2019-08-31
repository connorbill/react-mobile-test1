import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Layout.scss';
import SidePanel from './SidePanel';

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className="home-layout">
        <SidePanel></SidePanel>
        <div className="home-page-container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
