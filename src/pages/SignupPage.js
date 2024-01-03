import { Component } from "react";

class SignupPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  };

  onChange = (event) => {
    const { id, value } = event.target;
    const key = id === "password-repeat" ? "passwordRepeat" : id;
    this.setState({
      [key]: value,
    });
  };

  submit = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    }
    
    fetch("/api/1.0/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat } = this.state;
    if (password && passwordRepeat) {
      disabled = (password !== passwordRepeat);
    }

    return (
      <>
        <form>
          <h1>Sign Up</h1>
          <label htmlFor="username">Username</label>
          <input id="username" onChange={this.onChange} />

          <label htmlFor="email">E-mail</label>
          <input id="email" onChange={this.onChange} />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" onChange={this.onChange} />

          <label htmlFor="password-repeat">Password Repeat</label>
          <input id="password-repeat" type="password" onChange={this.onChange} />

          <button disabled={disabled} onClick={this.submit}>Sign Up</button>
        </form>
      </>
    );
  };
};

export default SignupPage;