const Spinner = () => {

  return (
      <>
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white opacity-50" style={{zIndex:20}}>
        <div className="spinner-border text-primary mb-3" style={{width: "4rem", height: "4rem"}} role="status"></div>
        <div className="fs-5 text-secondary">Loading...</div>
      </div>
    </>
  );
};

export default Spinner;
