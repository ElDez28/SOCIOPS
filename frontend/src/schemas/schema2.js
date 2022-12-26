import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required!")
    .email("Please provide valid email address!"),
  password: yup.string().required("This field is required!"),
});

export default loginSchema;
