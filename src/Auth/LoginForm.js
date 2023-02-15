import Alert from "../Common/Alert";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "react-router-dom";
import UserContext from "./UserContext";

const LoginForm = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErr, setFormErr] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let res = await login(formData);
    if (res.success) {
      navigate("/");
    } else {
      setFormErr(res.errors);
    }
  }

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((l) => ({ ...l, [name]: value }));
  };

  return (
    <div className="LoginForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h1 className="mb-3">Login</h1>
        <div className="card">
          <div className="card-body">
            <Form method="post" onSubmit={handleSubmit}>
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

              <button className="btn btn-sm btn-primary">Login</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
