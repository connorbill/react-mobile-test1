import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import './Recommend.scss';
import { ReactComponent as  ArrowsLeft } from '../../images/svg/arrows-left.svg';
import { ReactComponent as  Logo } from '../../images/svg/logo1.svg';


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
                {/*<img src="../../images/svg/arrows-left.svg" alt=""/>*/}
                <ArrowsLeft className="svg-icon" />

              </div>
            </div>
            <div className="goHome">
              <div className="company-name">
                <Logo className="logo-icon" />
              </div>
            </div>
            <ul className="quick-menu">
              <li>推荐</li>
              <li>分类</li>
              <li>历史</li>
              <li>我的</li>
            </ul>
          </div>
          <img src={require("../../images/home/headerBG.png")}  alt="" className="header-bg"/>
        </header>
        <ul className="hot-games">
          <li>
            <p className="flag">广东</p>
            <p className="lottery-ball"></p>
            <p className="hot-text"></p>
            <p>
              11:12:12:13
            </p>
            <p className="online">在线100人</p>
          </li>
        </ul>
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
