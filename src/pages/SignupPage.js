import { Component } from "react";

class SignupPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signupSuccess: false,
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
    });
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signupSuccess } = this.state;
    if (password && passwordRepeat) {
      disabled = (password !== passwordRepeat);
    }

    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {
          !signupSuccess &&
          <form className="card mt-5" data-testid="form-signup">
            <div className="card-header">
              <h1 className="text-center">Sign Up</h1>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input id="username" onChange={this.onChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input id="email" onChange={this.onChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input id="password" type="password" onChange={this.onChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label htmlFor="password-repeat" className="form-label">Password Repeat</label>
                <input id="password-repeat" type="password" onChange={this.onChange} className="form-control" />
              </div>

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