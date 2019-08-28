import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import './Recommend.scss';

export class Recommend extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="home-recommend-page">
        <header className="header">
          <div className="ts-menu">
            <div className="goback">
              <div className="m-icon-left">
                <img src="../../images/svg/arrows-left.svg" alt=""/>

              </div>
            </div>
            <ul className="quick-menu">
              <li>推荐</li>
              <li>分类</li>
              <li>历史</li>
              <li>我的</li>
            </ul>
          </div>
        </header>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Recommend);
