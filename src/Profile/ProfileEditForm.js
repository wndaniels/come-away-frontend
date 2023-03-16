import { useState, useContext, useEffect } from "react";
import UserContext from "../Auth/UserContext";
import { Form, useParams, useNavigate } from "react-router-dom";
import Alert from "../Common/Alert";
import ComeAwayApi from "../api/api";

const ProfileForm = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { username } = useParams(currentUser.username);

  useEffect(function getCurrentUsername() {});
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    username: currentUser.username,
  });

  const [formError, setFormError] = useState([]);
  const [savedEdit, setSavedEdit] = useState(false);

  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    let username = formData.username;
    let updateUser;

    try {
      updateUser = await ComeAwayApi.saveProfile(username, profileData);
    } catch (errors) {
      setFormError(errors);
      return;
    }

    navigate("/");
    setFormData((f) => ({ ...f }));
    setFormError([]);
    setSavedEdit(true);

    setCurrentUser(updateUser);
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    setFormError([]);
  }

  return (
    <div className="ProfileEditForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h1 className="mb-3">Profile Form</h1>
        <div className="card">
          <div className="card-body">
            <Form onSubmit={handleSubmit}>
              <div className="d-grid gap-2">
                <div className="form-group">
                  <h3>{formData.username}</h3>
                </div>
                <div className="form-group">
                  <label className="mb-1">First Name:</label>
                  <input
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="mb-1">Last Name:</label>
                  <input
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="mb-1">Email:</label>
                  <input
                    name="email"
                    className="form-control mb-3"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {formError.length ? (
                <Alert type="danger" messages={formError} />
              ) : null}

              {savedEdit ? (
                <Alert type="success" messages={["Updated successfully."]} />
              ) : null}

              <button className="btn btn-sm btn-primary float-right">
                Save Changes
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
