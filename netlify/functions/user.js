exports.handler = async (event, context) => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
    };
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  };
  