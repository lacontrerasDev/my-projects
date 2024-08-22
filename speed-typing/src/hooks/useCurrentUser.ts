const useCurrentUser = () => {
  const currentUserData = localStorage.getItem("currentUser");
  if (currentUserData) {
    const currentUser = JSON.parse(currentUserData);

    return currentUser;
  } else {
    return null;
  }
};

export default useCurrentUser;
