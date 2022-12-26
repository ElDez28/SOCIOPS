import "./signup.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useHttp } from "../../hooks/useHttp";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ErrorModal from "../../components/errorModal/ErrorModal";
import signupSchema from "../../schemas/schema1";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import { userActions } from "../../components/redux-store/store";

export const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: "easeInOut",
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.4,
    },
  },
};

function Signup() {
  const { error, sendRequest, clearError } = useHttp();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pickHandler = (e) => {
    formik.setFieldValue("photo", e.target.files[0]);
  };

  const initialValues = {
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    photo: "",
  };

  const signupFormSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("email", values.email);
      formData.append("passwordConfirm", values.passwordConfirm);
      if (values.image !== "") {
        formData.append("photo", values.photo);
      }
      const data = await sendRequest(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );
      const expDate = new Date().getTime() + 10 * 60 * 60 * 1000;
      dispatch(userActions.setUser(data.data.user));
      dispatch(userActions.setDate(expDate));
      dispatch(userActions.setIsLoggedInToTrue(data.token));

      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("exp", expDate);

      navigate("/", { replace: true });
      formik.resetForm();
    } catch (err) {}
  };
  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues,
    validationSchema: signupSchema,
    onSubmit: signupFormSubmit,
  });

  return (
    <div className="login">
      {error && (
        <ErrorModal onClick={clearError}>
          {error.response.data.message}
        </ErrorModal>
      )}
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Sociops</h3>
          <span className="loginDesc">Connect with your friends now!</span>
        </div>
        <form className="loginRight" onSubmit={formik.handleSubmit}>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="loginBox"
          >
            <div className="inputHolder">
              {" "}
              <input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
                placeholder="Username"
                id="username"
                type="text"
                className={`loginInput ${
                  formik.errors.username && formik.touched.username && "error"
                }`}
              />
              {}
            </div>
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Email"
              id="email"
              type="text"
              className={`loginInput ${
                formik.errors.email && formik.touched.email && "error"
              }`}
            />

            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Password"
              id="password"
              type="password"
              className={`loginInput ${
                formik.errors.password && formik.touched.password && "error"
              }`}
            />
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.passwordConfirm}
              placeholder="Confirm Password"
              type="password"
              id="passwordConfirm"
              className={`loginInput ${
                formik.errors.passwordConfirm &&
                formik.touched.passwordConfirm &&
                "error"
              }`}
            />
            <div className="fileContainer">
              <span className="fileLabel">Chose an image</span>
              <div className="filePreview">
                <label htmlFor="file" className="previewImage">
                  <img
                    className="previewImg"
                    crossOrigin="anonymous"
                    src={
                      formik.values.photo
                        ? URL.createObjectURL(formik.values.photo)
                        : "http://127.0.0.1:5000/public/images/users/default-user-2.png"
                    }
                    alt="profile"
                  ></img>
                </label>
                <input
                  onBlur={formik.handleBlur}
                  onChange={pickHandler}
                  accept=".jpg, .png, .jpeg"
                  type="file"
                  id="file"
                  className="file"
                ></input>
              </div>
            </div>
            <button className="loginButton">
              {formik.isSubmitting ? (
                <LoadingSpinner className="lds-dual-ring"></LoadingSpinner>
              ) : (
                "Sign Up"
              )}
            </button>
            <div className="signupLinks">
              <Link to="/login" className="loginRegisterButton">
                Switch to login <ArrowRightAltIcon></ArrowRightAltIcon>
              </Link>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
