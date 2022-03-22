class Service {
  static response = (status, message, data) => {
    if(!data || null)
    {
      return { status: status, message: message};
    }
    else
    {
      return { status: status, message: message,data:data};
    }
   
  };
}

export default Service;
