import { Component } from "react";
import Input from "../components/Input";

class SignupPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signupSuccess: false,
    errors: {},
  };

  onChange = (event) => {
    const { id, value } = event.target;
    const key = id === "password-repeat" ? "passwordRepeat" : id;

    const errorsCopy = JSON.parse(JSON.stringify(this.state.errors));
    delete errorsCopy[key];
    this.setState({
      [key]: value,
      errors: errorsCopy,
    });
  };

  submit = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true })

    fetch("/api/1.0/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then(() => {
      this.setState({ signupSuccess: true });
    }).catch((error) => {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
      }
      this.setState({ apiProgress: false });
    });
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signupSuccess, errors } = this.state;
    if (password && passwordRepeat) {
      disabled = (password !== passwordRepeat);
    }

    let passwordMismatch = password !== passwordRepeat ? "Password mismatch" : "";

    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {
          !signupSuccess &&
          <form className="card mt-5" data-testid="form-signup">
            <div className="card-header">
              <h1 className="text-center">Sign Up</h1>
            </div>
            <div className="card-body">
              <Input id="username" label="Username" onChange={this.onChange} help={errors.username} />
              <Input id="email" label="E-mail" onChange={this.onChange} help={errors.email} />
              <Input id="password" label="Password" onChange={this.onChange} help={errors.password} type="password" />
              <Input id="password-repeat" label="Password Repeat" onChange={this.onChange} help={passwordMismatch} type="password" />
              <div className="text-center">
                <button disabled={disabled || apiProgress} onClick={this.submit} className="btn btn-primary">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        }
        {
          signupSuccess &&
          <div class="alert alert-success mt-3">Please check your e-mail to activate your account</div>
        }
      </div>
    );
  };
};

export default SignupPage;