import { Component } from "react";
import { withTranslation } from "react-i18next";
import Input from "../components/Input";
import { signup } from "../api/apiCalls";

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

  submit = async (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true })

    try {
      await signup(body);
      this.setState({ signupSuccess: true });
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
      }
      this.setState({ apiProgress: false });
    };
  };

  render() {
    const { t } = this.props;
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signupSuccess, errors } = this.state;
    if (password && passwordRepeat) {
      disabled = (password !== passwordRepeat);
    }

    let passwordMismatch = password !== passwordRepeat ? t("passwordMismatchValidation") : "";

    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        {
          !signupSuccess &&
          <form className="card mt-5" data-testid="form-signup">
            <div className="card-header">
              <h1 className="text-center">{t("signup")}</h1>
            </div>
            <div className="card-body">
              <Input id="username" label={t("username")} onChange={this.onChange} help={errors.username} />
              <Input id="email" label={t("email")} onChange={this.onChange} help={errors.email} />
              <Input id="password" label={t("password")} onChange={this.onChange} help={errors.password} type="password" />
              <Input id="password-repeat" label={t("passwordRepeat")} onChange={this.onChange} help={passwordMismatch} type="password" />
              <div className="text-center">
                <button disabled={disabled || apiProgress} onClick={this.submit} className="btn btn-primary">
                  <span class="spinner-border spinner-border-sm" role="status"></span>
                  {t("signup")}
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

const SignupPageWithTranslation = withTranslation()(SignupPage);

export default SignupPageWithTranslation;