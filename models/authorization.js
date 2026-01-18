function can(user, feature, resource) {
  if (feature === "update:user" && resource) {
    if (user.id === resource.id) {
      return true;
    }

    return false;
  }

  if (user.features.includes(feature)) {
    return true;
  }

  return false;
}

const authorization = {
  can,
};
export default authorization;
