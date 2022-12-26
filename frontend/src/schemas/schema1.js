import * as yup from "yup";

const signupSchema = yup.object().shape({
  username: yup.string().required("This field is required!"),
  email: yup
    .string()
    .required("This field is required!")
    .email("Please provide valid email address!"),
  password: yup.string().required("This field is required!"),
  passwordConfirm: yup
    .string()
    .required("This field is required!")
    .oneOf([yup.ref("password"), null], "Password must match!"),
});

export default signupSchema;
