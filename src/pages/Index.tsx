import { useState } from "react";
import { DoctorLogin } from "@/components/DoctorLogin";
import { DoctorDashboard } from "@/components/DoctorDashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctorCredentials, setDoctorCredentials] = useState<{clinicId: string; password: string} | null>(null);

  const handleLogin = (credentials: {clinicId: string; password: string}) => {
    setDoctorCredentials(credentials);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDoctorCredentials(null);
  };

  return (
    <>
      {!isLoggedIn ? (
        <DoctorLogin onLogin={handleLogin} />
      ) : (
        <DoctorDashboard onLogout={handleLogout} />
      )}
    </>
  );
};

export default Index;
