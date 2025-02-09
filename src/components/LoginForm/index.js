import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  onChangeUserName = e => {
    this.setState({username: e.target.value})
  }

  onChangePassword = e => {
    this.setState({password: e.target.value})
  }

  onSubmitSuccessForm = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailureForm = errorMessage => {
    console.log(errorMessage)
    this.setState({errorMsg: errorMessage})
  }

  onSubmitForm = async e => {
    e.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccessForm(data.jwt_token)
    } else {
      this.onSubmitFailureForm(data.error_msg)
    }
  }

  render() {
    const {errorMsg, username, password} = this.state
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            className="logo-image"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label className="login-label" htmlFor="username">
            USERNAME
          </label>
          <input
            className="login-input"
            type="text"
            id="username"
            value={username}
            onChange={this.onChangeUserName}
          />
          <labe className="login-label" htmlFor="password">
            PASSWORD
          </labe>
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            onChange={this.onChangePassword}
          />
          <button className="login-btn" type="submit">
            Login
          </button>
          {errorMsg && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
