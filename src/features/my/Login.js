import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import './Login.scss';
import axios from 'axios';
import qs from 'qs';

export class Login extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {hashCode: '',command: '', username: ''};

    this.handleChangeHash = this.handleChangeHash.bind(this);
    this.handleChangeCommand = this.handleChangeCommand.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeHash(event) {
    this.setState({hashCode: event.target.value});
  }
  handleChangeCommand(event) {
    this.setState({command: event.target.value});
  }
  handleChangeUsername(event) {
    this.setState({username: event.target.value});
  }

  handleSubmit(event) {
    let s = {
      username: this.state.username, // 游戏用户名称(代理商平台的)
      device: 'H5', // 设备端
      walletDepositUrl: '', // 代理商充值通链接
      customerUrl: '', // 代理商客服通道链接
      lotteryCode: '', // 二级彩种
      playRuleCode: '', // 玩法代码(传空时定位到彩种首页)
      homeUrl: '' // 游戏大厅页面，玩家点此链接返回游戏大厅
    }
    s = JSON.stringify(s)
    let data = {
      hashCode: this.state.hashCode, // 代理商账号
      command: 'LOGIN', // 登录命令
      version: '1.0', // 接口版本号
      data: s
    }
    axios({
      url: '/openapi/app/test',
      method: 'post',
      data: qs.stringify(data)
    }).then(function(res) {
      console.log(res);
    })

  }

  componentDidMount() {
  }

  render() {

    return (
      <div className="login-default-page">
        <div className="login-container">
          <ul>
            <li>
              <span>
                <input type="text" value={this.state.hashCode} onChange={this.handleChangeHash} placeholder='请输入代理商UUID编号'/>
              </span>
            </li>
            <li>
              <span>
                <input type="text" value={this.state.username} onChange={this.handleChangeUsername}  placeholder='请输入游戏用户名称(代理商平台的)' />
              </span>
            </li>
            <li>
              <span>
                <input type="text" placeholder='请输入代理商游戏大厅链接'/>
              </span>
            </li>
            <li>
              <span>
                <input type="text" placeholder='请输入代理商充值通道链接'/>
              </span>
            </li>
            <li>
              <span>
                <input type="text" placeholder='请输入代理商客服通道链接'/>
              </span>
            </li>
            <li>
              <select name="" id="">
                <option value="h5"></option>
              </select>
            </li>
            <li>
              <button onClick={this.handleSubmit}>登录</button>
            </li>
          </ul>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
