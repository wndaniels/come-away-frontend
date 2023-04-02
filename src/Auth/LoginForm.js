import Alert from "../Common/Alert.js";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext.js";

/**
 * LOGIN FORM:
 *
 * Renders form and manages update to state on changes.
 *
 * On submission, calls login prop, navigates "/"
 *
 * Routes -> LoginForm -> Alert
 * Routed as /login
 *
 */

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErr, setFormErr] = useState([]);

  /**
   * Handle Form Submit:
   *
   * Calls login function prop and if successful, navigates to homepage.
   **/

  async function handleSubmit(evt) {
    evt.preventDefault();
    let res = await login(formData);
    if (res.success) {
      navigate("/");
    } else {
      setFormErr(res.errors);
    }
  }

  /**
   * Handles update for form data fields.
   */
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((l) => ({ ...l, [name]: value }));
  };

  return (
    <div className="LoginForm m-5">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h1 data-testid="header" className="mb-3">
          Login
        </h1>
        <div className="card">
          <div className="card-body">
            <form method="post" onSubmit={handleSubmit}>
              <div className="d-grid gap-3">
                <div className="form-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control mb-3"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {formErr.length ? (
                <Alert type="danger" messages={formErr} />
              ) : null}

              <button onClick={handleSubmit} className="btn btn-sm btn-primary">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
