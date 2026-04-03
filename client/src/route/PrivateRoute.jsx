import { useNavigate } from "react-router-dom";
import { authHooks } from "../hooks/authHooks";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = authHooks.useGetUser();
  const { isBoarded, isLoading: boardLoading } =
    authHooks.useGetOnboardStatus();

  useEffect(() => {
    if (!userLoading && !boardLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isBoarded) {
        navigate("/onboarding");
      }
    }
  }, [user, isBoarded, userLoading, boardLoading, navigate]);

  if (userLoading || boardLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
