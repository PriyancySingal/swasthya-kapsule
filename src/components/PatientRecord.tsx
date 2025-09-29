import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Heart, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Plus,
  Save,
  Shield,
  Clock,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

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

interface PatientRecordProps {
  patient: Patient;
  otpVerified: boolean;
  onBack: () => void;
  onLogout: () => void;
}

export const PatientRecord = ({ patient, otpVerified, onBack, onLogout }: PatientRecordProps) => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(!otpVerified);
  const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory);
  const [newEntry, setNewEntry] = useState({
    diagnosis: "",
    treatment: "",
    notes: ""
  });

  const handleOtpVerification = () => {
    if (otpInput === "123456" || otpInput.length === 6) {
      setIsVerifying(false);
      toast.success("Patient consent verified successfully");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSaveEntry = () => {
    if (!newEntry.diagnosis.trim()) {
      toast.error("Please enter a diagnosis");
      return;
    }
    
    // Create new medical history entry
    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0], // Today's date
      diagnosis: newEntry.diagnosis,
      treatment: newEntry.treatment || "No specific treatment prescribed",
      doctor: "Dr. Rajeev Nair", // Current logged in doctor
      clinic: "Primary Health Center, Kochi"
    };
    
    // Add to beginning of medical history (most recent first)
    setMedicalHistory([newHistoryEntry, ...medicalHistory]);
    
    toast.success("Medical record updated successfully");
    setShowNewEntry(false);
    setNewEntry({ diagnosis: "", treatment: "", notes: "" });
  };

  // OTP Verification Screen
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-header text-white shadow-medical">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scanner
              </Button>
              <h1 className="text-lg font-semibold">Patient Consent Verification</h1>
              <Button variant="outline" onClick={onLogout} className="border-white/20 text-white hover:bg-white/10">
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-elevated">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Patient Consent Required</CardTitle>
              <CardDescription>
                An OTP has been sent to the patient's registered mobile number for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-accent/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Patient Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{patient.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Patient ID:</span>
                    <p className="font-medium">{patient.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blood Group:</span>
                    <p className="font-medium">{patient.bloodGroup}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP (6 digits)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Ask the patient to provide the 6-digit OTP received on their mobile
                </p>
              </div>

              <Button
                onClick={handleOtpVerification}
                disabled={otpInput.length !== 6}
                className="w-full bg-gradient-medical hover:bg-primary-dark"
                size="lg"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verify & Access Records
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Didn't receive OTP? Resend
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header text-white shadow-medical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-4">
              <User className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-semibold">Patient Record</h1>
                <p className="text-xs text-white/80">Swasthya Saathi • {patient.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Dr. Rajeev Nair</p>
                <p className="text-xs text-white/80">Primary Health Center, Kochi</p>
              </div>
              <Button variant="outline" onClick={onLogout} className="border-white/30 text-white hover:bg-white/20">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Patient Card */}
            <Card className="shadow-elevated">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-medical rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{patient.name}</h3>
                  <p className="text-muted-foreground">Age: {patient.age} years</p>
                  <Badge className="mt-2 bg-primary">{patient.id}</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Blood Group</p>
                      <p className="text-sm text-muted-foreground">{patient.bloodGroup}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{patient.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Emergency Contact</p>
                      <p className="text-sm text-muted-foreground">{patient.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Allergies Card */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Known Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="mr-2">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medical History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Medical History</h2>
                <p className="text-muted-foreground">Complete chronological health record</p>
              </div>
              
              <Button
                onClick={() => setShowNewEntry(true)}
                className="bg-gradient-medical hover:bg-primary-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Entry
              </Button>
            </div>

            {/* New Entry Form */}
            {showNewEntry && (
              <Card className="shadow-elevated border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Add New Medical Entry</CardTitle>
                  <CardDescription>Record today's consultation and treatment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Input
                        id="diagnosis"
                        placeholder="e.g., Hypertension, Common Cold"
                        value={newEntry.diagnosis}
                        onChange={(e) => setNewEntry({...newEntry, diagnosis: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment/Medication</Label>
                      <Input
                        id="treatment"
                        placeholder="e.g., Paracetamol 500mg twice daily"
                        value={newEntry.treatment}
                        onChange={(e) => setNewEntry({...newEntry, treatment: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional observations or recommendations..."
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleSaveEntry} className="bg-gradient-medical hover:bg-primary-dark">
                      <Save className="h-4 w-4 mr-2" />
                      Save Entry
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medical History Timeline */}
            <div className="space-y-4">
              {medicalHistory.map((entry, index) => (
                <Card key={index} className="shadow-card hover:shadow-medical transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-lg text-foreground">{entry.diagnosis}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(entry.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{entry.clinic}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {index === 0 ? 'Latest' : entry.date === new Date().toISOString().split('T')[0] ? 'Today' : `${index + 1} visits ago`}
                      </Badge>
                    </div>

                    <div className="ml-6 space-y-3">
                      <div>
                        <h5 className="font-medium text-sm text-foreground mb-1">Treatment:</h5>
                        <p className="text-sm text-muted-foreground">{entry.treatment}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        <span>Dr. {entry.doctor}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Consultation completed</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};