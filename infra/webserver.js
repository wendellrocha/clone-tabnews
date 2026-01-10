function getOrigin() {
  if (["development", "test"].includes(process.env.NODE_ENV)) {
    return `http://localhost:${process.env.PORT}`;
  }

  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "https://tabnews.wendellrocha.dev.br";
}

const webserver = {
  origin: getOrigin(),
};

export default webserver;
