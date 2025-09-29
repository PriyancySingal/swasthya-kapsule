import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

interface QRScannerProps {
  onScan: (qrData: string) => void;
  onCancel: () => void;
}

export const QRScanner = ({ onScan, onCancel }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'found' | 'error'>('idle');

  const startScanning = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    
    // Simulate QR scanning process
    setTimeout(() => {
      setScanStatus('found');
      setTimeout(() => {
        // Simulate finding patient with ID SW001234
        onScan('SW001234');
      }, 1000);
    }, 3000);
  };

  const simulateError = () => {
    setScanStatus('error');
    setTimeout(() => {
      setScanStatus('idle');
      setIsScanning(false);
    }, 2000);
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
              <QrCode className="h-6 w-6" />
              <h1 className="text-lg font-semibold">QR Scanner</h1>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Scanner Interface */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Patient QR Code Scanner</h2>
          <p className="text-muted-foreground">Position the patient's Swasthya Card QR code within the scanning area</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-elevated">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-lg overflow-hidden">
                  {/* Camera View Simulation */}
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-lg"></div>
                    
                    {/* Scanning Frame */}
                    <div className="relative w-64 h-64 border-4 border-primary rounded-lg">
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                      
                      {/* Scanning Animation */}
                      {scanStatus === 'scanning' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-1 bg-primary animate-pulse"></div>
                        </div>
                      )}
                      
                      {/* Status Icons */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {scanStatus === 'idle' && (
                          <QrCode className="h-16 w-16 text-white/50" />
                        )}
                        {scanStatus === 'scanning' && (
                          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {scanStatus === 'found' && (
                          <CheckCircle className="h-16 w-16 text-success animate-pulse" />
                        )}
                        {scanStatus === 'error' && (
                          <AlertCircle className="h-16 w-16 text-destructive animate-pulse" />
                        )}
                      </div>
                    </div>
                    
                    {/* Status Text */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant={
                        scanStatus === 'scanning' ? 'default' :
                        scanStatus === 'found' ? 'default' :
                        scanStatus === 'error' ? 'destructive' : 'secondary'
                      }>
                        {scanStatus === 'idle' && 'Position QR code in frame'}
                        {scanStatus === 'scanning' && 'Scanning...'}
                        {scanStatus === 'found' && 'QR Code Found!'}
                        {scanStatus === 'error' && 'QR Code not recognized'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="p-6 bg-card">
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={startScanning}
                      disabled={isScanning}
                      className="bg-gradient-medical hover:bg-primary-dark"
                      size="lg"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      {isScanning ? 'Scanning...' : 'Start Scanning'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={simulateError}
                      disabled={isScanning}
                      size="lg"
                    >
                      Test Error
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions Panel */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Scanning Instructions</CardTitle>
                <CardDescription>Follow these steps for successful QR scanning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <p className="text-sm text-muted-foreground">Ask patient to present their Swasthya Card</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <p className="text-sm text-muted-foreground">Position the QR code within the blue scanning frame</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <p className="text-sm text-muted-foreground">Hold steady until the scan is complete</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <p className="text-sm text-muted-foreground">Enter OTP when prompted for verification</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm text-muted-foreground">OTP verification required</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm text-muted-foreground">Patient consent mandatory</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm text-muted-foreground">Encrypted data transmission</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm text-muted-foreground">Audit trail maintained</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};