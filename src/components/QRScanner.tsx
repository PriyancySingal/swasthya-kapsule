import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, ArrowLeft, CheckCircle, AlertCircle, Scan, Zap, Wifi } from "lucide-react";

interface QRScannerProps {
  onScan: (qrData: string) => void;
  onCancel: () => void;
}

export const QRScanner = ({ onScan, onCancel }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'initializing' | 'scanning' | 'focusing' | 'found' | 'error'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningLine, setScanningLine] = useState(0);

  // Realistic scanning animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (scanStatus === 'scanning') {
      interval = setInterval(() => {
        setScanningLine(prev => (prev + 2) % 100);
      }, 50);
    }
    
    return () => clearInterval(interval);
  }, [scanStatus]);

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (scanStatus === 'scanning' || scanStatus === 'focusing') {
      interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 200);
    }
    
    return () => clearInterval(interval);
  }, [scanStatus]);

  const startScanning = () => {
    setIsScanning(true);
    setScanStatus('initializing');
    setScanProgress(0);
    
    // Simulate realistic camera initialization
    setTimeout(() => {
      setScanStatus('scanning');
      
      // Simulate focusing process
      setTimeout(() => {
        setScanStatus('focusing');
        
        // Simulate QR detection
        setTimeout(() => {
          setScanStatus('found');
          setTimeout(() => {
            onScan('SW001234'); // Found patient
          }, 800);
        }, 2500);
      }, 2000);
    }, 1000);
  };

  const simulateError = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setScanProgress(0);
    
    setTimeout(() => {
      setScanStatus('error');
      setTimeout(() => {
        setScanStatus('idle');
        setIsScanning(false);
        setScanProgress(0);
      }, 2500);
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
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Dr. Rajeev Nair</p>
                <p className="text-xs text-white/80">Primary Health Center, Kochi</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Scanner Interface */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Patient QR Code Scanner</h2>
          <p className="text-muted-foreground">Position the patient's Swasthya Card QR code within the scanning area</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Scanner Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-elevated">
              <CardContent className="p-0">
                {/* Camera Status Bar */}
                <div className="bg-gray-900 text-white p-3 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                      <span className="text-sm font-medium">
                        {scanStatus === 'idle' && 'Camera Ready'}
                        {scanStatus === 'initializing' && 'Initializing Camera...'}
                        {scanStatus === 'scanning' && 'Scanning for QR Code...'}
                        {scanStatus === 'focusing' && 'QR Code Detected - Focusing...'}
                        {scanStatus === 'found' && 'QR Code Successfully Read!'}
                        {scanStatus === 'error' && 'QR Code Not Recognized'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4" />
                      <span className="text-xs">Live Feed</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar for Scanning */}
                  {(scanStatus === 'scanning' || scanStatus === 'focusing') && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-200"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                  {/* Simulated Camera Feed with Grid */}
                  <div className="absolute inset-0">
                    <div className="w-full h-full opacity-20">
                      <div className="grid grid-cols-8 grid-rows-6 w-full h-full">
                        {Array.from({length: 48}).map((_, i) => (
                          <div key={i} className="border border-gray-600/30"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Camera View Simulation with moving particles */}
                  <div className="absolute inset-0">
                    {isScanning && (
                      <div className="absolute inset-0">
                        {/* Animated scanning particles */}
                        {Array.from({length: 12}).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Central Scanning Frame */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-72 h-72">
                      {/* Dynamic Corner Brackets */}
                      <div className="absolute inset-0">
                        {/* Top-left corner */}
                        <div className={`absolute -top-2 -left-2 w-12 h-12 border-t-4 border-l-4 rounded-tl-lg transition-all duration-300 ${
                          scanStatus === 'found' ? 'border-green-400' : 
                          scanStatus === 'error' ? 'border-red-400' :
                          scanStatus === 'focusing' ? 'border-yellow-400' : 'border-primary'
                        }`}></div>
                        
                        {/* Top-right corner */}
                        <div className={`absolute -top-2 -right-2 w-12 h-12 border-t-4 border-r-4 rounded-tr-lg transition-all duration-300 ${
                          scanStatus === 'found' ? 'border-green-400' : 
                          scanStatus === 'error' ? 'border-red-400' :
                          scanStatus === 'focusing' ? 'border-yellow-400' : 'border-primary'
                        }`}></div>
                        
                        {/* Bottom-left corner */}
                        <div className={`absolute -bottom-2 -left-2 w-12 h-12 border-b-4 border-l-4 rounded-bl-lg transition-all duration-300 ${
                          scanStatus === 'found' ? 'border-green-400' : 
                          scanStatus === 'error' ? 'border-red-400' :
                          scanStatus === 'focusing' ? 'border-yellow-400' : 'border-primary'
                        }`}></div>
                        
                        {/* Bottom-right corner */}
                        <div className={`absolute -bottom-2 -right-2 w-12 h-12 border-b-4 border-r-4 rounded-br-lg transition-all duration-300 ${
                          scanStatus === 'found' ? 'border-green-400' : 
                          scanStatus === 'error' ? 'border-red-400' :
                          scanStatus === 'focusing' ? 'border-yellow-400' : 'border-primary'
                        }`}></div>
                      </div>
                      
                      {/* Scanning Line Animation */}
                      {scanStatus === 'scanning' && (
                        <div 
                          className="absolute left-0 right-0 h-0.5 bg-primary shadow-lg transition-all duration-75"
                          style={{ top: `${scanningLine}%` }}
                        ></div>
                      )}
                      
                      {/* Focus Animation */}
                      {scanStatus === 'focusing' && (
                        <div className="absolute inset-0">
                          <div className="w-full h-full border-2 border-yellow-400 rounded-lg animate-pulse"></div>
                          <div className="absolute inset-4 border border-yellow-400 rounded animate-ping"></div>
                        </div>
                      )}
                      
                      {/* Center Status Icons */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {scanStatus === 'idle' && (
                          <QrCode className="h-20 w-20 text-white/50" />
                        )}
                        {scanStatus === 'initializing' && (
                          <Camera className="h-20 w-20 text-primary animate-pulse" />
                        )}
                        {scanStatus === 'scanning' && (
                          <Scan className="h-20 w-20 text-primary animate-spin" />
                        )}
                        {scanStatus === 'focusing' && (
                          <div className="relative">
                            <QrCode className="h-20 w-20 text-yellow-400" />
                            <Zap className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-bounce" />
                          </div>
                        )}
                        {scanStatus === 'found' && (
                          <CheckCircle className="h-20 w-20 text-green-400 animate-pulse" />
                        )}
                        {scanStatus === 'error' && (
                          <AlertCircle className="h-20 w-20 text-red-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Status Display */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <Badge 
                      variant={
                        scanStatus === 'found' ? 'default' :
                        scanStatus === 'error' ? 'destructive' : 
                        scanStatus === 'focusing' ? 'default' : 'secondary'
                      }
                      className={`text-sm px-4 py-2 ${
                        scanStatus === 'found' ? 'bg-green-500 text-white' :
                        scanStatus === 'focusing' ? 'bg-yellow-500 text-white' :
                        scanStatus === 'scanning' ? 'bg-primary text-white animate-pulse' : ''
                      }`}
                    >
                      {scanStatus === 'idle' && '📷 Position QR code in frame'}
                      {scanStatus === 'initializing' && '⚡ Starting camera...'}
                      {scanStatus === 'scanning' && '🔍 Scanning for QR code...'}
                      {scanStatus === 'focusing' && '🎯 Reading QR data...'}
                      {scanStatus === 'found' && '✅ QR Code Successfully Read!'}
                      {scanStatus === 'error' && '❌ QR Code not recognized'}
                    </Badge>
                  </div>
                </div>
                
                {/* Enhanced Controls */}
                <div className="p-6 bg-card">
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={startScanning}
                      disabled={isScanning}
                      className="bg-gradient-medical hover:bg-primary-dark px-8"
                      size="lg"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      {isScanning ? 'Scanning Active...' : 'Start QR Scanner'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={simulateError}
                      disabled={isScanning}
                      size="lg"
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Test Error Case
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Hold the Swasthya Card steady • Ensure good lighting • QR code must be clearly visible
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Instructions Panel */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Scanning Guide</CardTitle>
                <CardDescription>Follow these steps for optimal scanning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="text-sm font-medium">Prepare Swasthya Card</p>
                      <p className="text-xs text-muted-foreground">Ensure QR code is clean and unfolded</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="text-sm font-medium">Position Card</p>
                      <p className="text-xs text-muted-foreground">Center QR code within scanning frame</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="text-sm font-medium">Hold Steady</p>
                      <p className="text-xs text-muted-foreground">Keep card stable until scan completes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <div>
                      <p className="text-sm font-medium">Verify Patient</p>
                      <p className="text-xs text-muted-foreground">Wait for OTP verification process</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Scanner Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Camera Access</span>
                    <Badge variant="default" className="bg-green-500">
                      ✓ Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">QR Detection</span>
                    <Badge variant={isScanning ? "default" : "secondary"}>
                      {isScanning ? "🔍 Scanning" : "⏸️ Standby"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Connection</span>
                    <Badge variant="default" className="bg-green-500">
                      ✓ Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Security Protocol</span>
                    <Badge variant="default" className="bg-green-500">
                      🔒 Encrypted
                    </Badge>
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
                    <p className="text-sm text-muted-foreground">Real-time OTP verification</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm text-muted-foreground">Patient consent mandatory</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm text-muted-foreground">End-to-end encryption</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="text-sm text-muted-foreground">Complete audit trail</p>
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