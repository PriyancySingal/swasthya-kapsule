import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Search, LogOut, User, Calendar, Clock } from "lucide-react";
import { QRScanner } from "./QRScanner";
import { PatientRecord } from "./PatientRecord";
import { ManualSearch } from "./ManualSearch";

interface DoctorDashboardProps {
  onLogout: () => void;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  photo: string;
  phone: string;
  emergencyContact: string;
  allergies: string[];
  medicalHistory: {
    date: string;
    diagnosis: string;
    treatment: string;
    doctor: string;
    clinic: string;
  }[];
}

// Sample patient data
const samplePatients: Record<string, Patient> = {
  "SW001234": {
    id: "SW001234",
    name: "Sunil Kumar",
    age: 32,
    bloodGroup: "B+",
    photo: "/api/placeholder/120/120",
    phone: "+91 98765 43210",
    emergencyContact: "+91 87654 32109",
    allergies: ["Penicillin", "Dust"],
    medicalHistory: [
      {
        date: "2024-01-15",
        diagnosis: "Hypertension - Stage 1",
        treatment: "Amlodipine 5mg daily, lifestyle modifications",
        doctor: "Dr. Rajeev Nair",
        clinic: "Primary Health Center, Kochi"
      },
      {
        date: "2024-02-20",
        diagnosis: "Upper Respiratory Infection",
        treatment: "Azithromycin 500mg x 3 days, rest",
        doctor: "Dr. Priya Menon",
        clinic: "Community Health Center, Ernakulam"
      }
    ]
  }
};

export const DoctorDashboard = ({ onLogout }: DoctorDashboardProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleQRScan = (qrData: string) => {
    const patient = samplePatients[qrData];
    if (patient) {
      setSelectedPatient(patient);
      setShowScanner(false);
      setShowManualSearch(false);
      // In real implementation, OTP would be sent to patient's phone
      setTimeout(() => setOtpVerified(true), 2000);
    }
  };

  const handleManualPatientFound = (patientId: string) => {
    const patient = samplePatients[patientId];
    if (patient) {
      setSelectedPatient(patient);
      setShowScanner(false);
      setShowManualSearch(false);
      // In real implementation, OTP would be sent to patient's phone
      setTimeout(() => setOtpVerified(true), 2000);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedPatient(null);
    setOtpVerified(false);
    setShowScanner(false);
    setShowManualSearch(false);
  };

  if (selectedPatient) {
    return (
      <PatientRecord
        patient={selectedPatient}
        otpVerified={otpVerified}
        onBack={handleBackToDashboard}
        onLogout={onLogout}
      />
    );
  }

  if (showManualSearch) {
    return (
      <ManualSearch
        onPatientFound={handleManualPatientFound}
        onCancel={() => setShowManualSearch(false)}
      />
    );
  }

  if (showScanner) {
    return (
      <QRScanner
        onScan={handleQRScan}
        onCancel={() => setShowScanner(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header text-white shadow-medical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Swasthya Saathi</h1>
                <p className="text-xs text-white/80">Doctor Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Dr. Rajeev Nair</p>
                <p className="text-xs text-white/80">Primary Health Center, Kochi</p>
                <p className="text-xs text-white/60">Clinic ID: KRL-MED-001</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onLogout}
                className="bg-white/15 hover:bg-white/25 border-white/30 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Patient Portal Dashboard</h2>
          <p className="text-muted-foreground">Scan patient QR codes to access medical records securely</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Patients</p>
                  <p className="text-2xl font-bold text-foreground">23</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Records Updated</p>
                  <p className="text-2xl font-bold text-foreground">18</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Consultation</p>
                  <p className="text-2xl font-bold text-foreground">12 min</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner Card */}
          <Card className="shadow-elevated border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <QrCode className="h-6 w-6" />
                Patient QR Scanner
              </CardTitle>
              <CardDescription>
                Scan the patient's Swasthya Card to access their complete medical history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Instructions:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Click "Scan QR Code" below</li>
                  <li>2. Position patient's card in camera view</li>
                  <li>3. Wait for OTP verification with patient</li>
                  <li>4. Access complete medical history</li>
                </ol>
              </div>
              
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full h-12 bg-gradient-medical hover:bg-primary-dark"
                size="lg"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Scan Patient QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Manual Search Card */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Search className="h-6 w-6 text-muted-foreground" />
                Manual Patient Search
              </CardTitle>
              <CardDescription>
                Alternative lookup method when QR scanning is not available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Manual Search</span>
                  <Badge variant="default" className="bg-success">Available</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Search patients by name, ID, or phone number when QR scanning is not available
                </p>
              </div>
              
              <Button
                onClick={() => setShowManualSearch(true)}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
              >
                <Search className="h-5 w-5 mr-2" />
                Search by Patient Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest patient consultations and record updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { patient: "Raj Patel", action: "Record Updated", time: "5 minutes ago", status: "completed" },
                { patient: "Priya Singh", action: "New Consultation", time: "12 minutes ago", status: "completed" },
                { patient: "Kumar Das", action: "QR Scanned", time: "18 minutes ago", status: "in-progress" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">{activity.patient}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <Badge variant={activity.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};