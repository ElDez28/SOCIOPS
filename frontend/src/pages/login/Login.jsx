import "./login.css";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { variants } from "../signup/Signup";
import { useFormik } from "formik";
import { useHttp } from "../../hooks/useHttp";
import loginSchema from "../../schemas/schema2";
import { userActions } from "../../components/redux-store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../components/errorModal/ErrorModal";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, sendRequest, clearError } = useHttp();
  console.log(error);
  const initialValues = {
    email: "",
    password: "",
  };

  const loginFormSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      const data = await sendRequest(
        "post",
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        formData,
        { "Content-Type": "application/json" }
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
    } catch (err) {
      console.log(err);
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    initialValues,
    validationSchema: loginSchema,
    onSubmit: loginFormSubmit,
  });
  return (
    <div className="login">
      <div className="loginWrapper">
        {error && (
          <ErrorModal onClick={clearError}>
            {error.response.data.message}
          </ErrorModal>
        )}
        <div className="loginLeft">
          <h3 className="loginLogo">Sociops</h3>
          <span className="loginDesc">Connect with your friends now!</span>
        </div>
        <form onSubmit={formik.handleSubmit} className="loginRight">
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="loginBox"
          >
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Email"
              type="text"
              id="email"
              className={`loginInput ${
                formik.errors.email && formik.touched.email && "error"
              }`}
            />
            <input
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              type="password"
              id="password"
              placeholder="Password"
              className={`loginInput ${
                formik.errors.password && formik.touched.password && "error"
              }`}
            />

            <button type="submit" className="loginButton">
              {formik.isSubmitting ? (
                <LoadingSpinner className="lds-dual-ring"></LoadingSpinner>
              ) : (
                "Log in"
              )}
            </button>
            <div className="loginLinks">
              <Link to="/signup" className="loginRegisterButton">
                Switch to sign up <ArrowRightAltIcon></ArrowRightAltIcon>
              </Link>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default Login;
