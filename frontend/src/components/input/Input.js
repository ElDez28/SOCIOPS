const Input = (props) => {
  const element =
    props.element === "input" ? (
      <>
        <input
          onChange={props.formik.handleChange}
          id={props.id}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onBlur={props.formik.handleBlur}
          name={props.name}
        ></input>
        {props.error && props.touched && <p>{props.error}</p>}
      </>
    ) : (
      <>
        <textarea
          onChange={props.formik.handleChange}
          type={props.type}
          id={props.id}
          rows={props.rows || 3}
          value={props.value}
          onBlur={props.formik.handleBlur}
          name={props.name}
        ></textarea>
        {props.error && props.touched && <p>{props.error}</p>}
      </>
    );
  return (
    <div
      className={`form-control ${
        props.error && props.touched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};

export default Input;
