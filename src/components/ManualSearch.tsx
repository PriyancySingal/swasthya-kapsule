import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Search, 
  User, 
  Phone, 
  Heart, 
  Calendar,
  MapPin,
  Loader2,
  UserCheck
} from "lucide-react";

interface ManualSearchProps {
  onPatientFound: (patientId: string) => void;
  onCancel: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  age: number;
  phone: string;
  bloodGroup: string;
  lastVisit: string;
  clinic: string;
}

// Sample patient database for search
const patientDatabase: Record<string, SearchResult> = {
  "SW001234": {
    id: "SW001234",
    name: "Sunil Kumar",
    age: 32,
    phone: "+91 98765 43210",
    bloodGroup: "B+",
    lastVisit: "2024-02-20",
    clinic: "Community Health Center, Ernakulam"
  },
  "SW001235": {
    id: "SW001235", 
    name: "Raj Patel",
    age: 28,
    phone: "+91 87654 32109",
    bloodGroup: "O+",
    lastVisit: "2024-01-15",
    clinic: "Primary Health Center, Kochi"
  },
  "SW001236": {
    id: "SW001236",
    name: "Priya Singh", 
    age: 35,
    phone: "+91 76543 21098",
    bloodGroup: "A-",
    lastVisit: "2024-03-10",
    clinic: "District Hospital, Thiruvananthapuram"
  },
  "SW001237": {
    id: "SW001237",
    name: "Kumar Das",
    age: 29,
    phone: "+91 65432 10987",
    bloodGroup: "AB+",
    lastVisit: "2024-02-28",
    clinic: "Community Health Center, Kollam"
  }
};

export const ManualSearch = ({ onPatientFound, onCancel }: ManualSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<SearchResult | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API search delay
    setTimeout(() => {
      const results = Object.values(patientDatabase).filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery)
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1200);
  };

  const handlePatientSelect = (patient: SearchResult) => {
    setSelectedPatient(patient);
  };

  const handleConfirmSelection = () => {
    if (selectedPatient) {
      onPatientFound(selectedPatient.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header text-white shadow-medical">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-3">
              <Search className="h-6 w-6" />
              <h1 className="text-lg font-semibold">Manual Patient Search</h1>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Search Interface */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Find Patient Records</h2>
          <p className="text-muted-foreground">Search by patient name, ID, or phone number</p>
        </div>

        {/* Search Form */}
        <Card className="shadow-elevated mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Search className="h-6 w-6 text-primary" />
              Patient Search
            </CardTitle>
            <CardDescription>
              Enter patient details to locate their medical records in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search patients</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter patient name, ID (e.g., SW001234), or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 text-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="h-12 px-8 bg-gradient-medical hover:bg-primary-dark"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Quick search:</span>
              {["Sunil Kumar", "SW001234", "Raj Patel"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="h-7 text-xs"
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length} found)</CardTitle>
              <CardDescription>Click on a patient to select their record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-medical ${
                      selectedPatient?.id === patient.id 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <Badge variant="secondary">{patient.id}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Age: {patient.age}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{patient.bloodGroup}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{patient.phone}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()} - {patient.clinic}</span>
                          </div>
                        </div>
                      </div>

                      {selectedPatient?.id === patient.id && (
                        <div className="flex items-center text-primary">
                          <UserCheck className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedPatient && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Selected:</span>
                      <span className="font-medium ml-2">{selectedPatient.name} ({selectedPatient.id})</span>
                    </div>
                    <Button
                      onClick={handleConfirmSelection}
                      className="bg-gradient-medical hover:bg-primary-dark"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Access Patient Record
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {searchResults.length === 0 && searchQuery && !isSearching && (
          <Card className="shadow-card">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No patients found</h3>
              <p className="text-muted-foreground mb-4">
                No records match "{searchQuery}". Please check the spelling or try a different search term.
              </p>
              <Button variant="outline" onClick={() => {setSearchQuery(""); setSearchResults([]);}}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Search Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Search by Name</h4>
                <p className="text-muted-foreground">Enter full or partial patient name (e.g., "Sunil Kumar" or "Sunil")</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Search by Patient ID</h4>
                <p className="text-muted-foreground">Enter complete Swasthya card ID (e.g., "SW001234")</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Search by Phone</h4>
                <p className="text-muted-foreground">Enter registered mobile number (e.g., "98765")</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};