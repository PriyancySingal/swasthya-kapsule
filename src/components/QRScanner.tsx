import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Camera, AlertCircle, RefreshCw, Upload, Zap, ZapOff, RotateCcw, CheckCircle, Wifi, Signal } from "lucide-react";
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (qrData: string) => void;
  onCancel: () => void;
}

export const QRScanner = ({ onScan, onCancel }: QRScannerProps) => {
  const [scanningState, setScanningState] = useState<'idle' | 'initializing' | 'scanning' | 'card-detected' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [scanProgress, setScanProgress] = useState(0);
  const [cardDetected, setCardDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  // Realistic scanning simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (scanningState === 'scanning') {
      interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + Math.random() * 8;
          
          // Simulate card detection
          if (newProgress > 30 && !cardDetected) {
            setCardDetected(true);
            setScanningState('card-detected');
            setTimeout(() => {
              setScanningState('processing');
              setTimeout(() => {
                setScanningState('success');
                setTimeout(() => {
                  onScan('SW001234'); // Sample scan result
                }, 1000);
              }, 2000);
            }, 1500);
          }
          
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 150);
    }
    
    return () => clearInterval(interval);
  }, [scanningState, cardDetected, onScan]);

  const startCameraScanning = async () => {
    try {
      setScanningState('initializing');
      setProgress(0);
      setErrorMessage("");
      setScanProgress(0);
      setCardDetected(false);

      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      // Simulate camera initialization
      const initSteps = [
        { delay: 300, progress: 20, status: 'Requesting camera access...' },
        { delay: 600, progress: 40, status: 'Initializing camera feed...' },
        { delay: 900, progress: 70, status: 'Setting up QR detection...' },
        { delay: 1200, progress: 100, status: 'Camera ready' }
      ];

      for (const step of initSteps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
      }

      // Start actual camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: cameraFacing }
      });
      
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          setScanningState('success');
          setTimeout(() => {
            qrScannerRef.current?.stop();
            onScan(result.data);
          }, 1000);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
      setScanningState('scanning');

    } catch (error) {
      console.error('Camera access error:', error);
      setScanningState('error');
      setErrorMessage("Failed to access camera. Please check permissions or try uploading an image.");
      setProgress(0);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setScanningState('processing');
      setProgress(30);
      setErrorMessage("");

      const result = await QrScanner.scanImage(file);
      setProgress(100);
      setScanningState('success');
      setTimeout(() => onScan(result), 1000);
    } catch (error) {
      console.error('QR scan error:', error);
      setScanningState('error');
      setErrorMessage("No QR code found in the uploaded image. Please try a clearer image.");
      setProgress(0);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleFlash = async () => {
    if (qrScannerRef.current) {
      try {
        // Note: Flash control might not be available on all devices/browsers
        // This is a placeholder for flash functionality
        setFlashEnabled(!flashEnabled);
        console.log('Flash toggled:', !flashEnabled);
      } catch (error) {
        console.error('Flash toggle error:', error);
      }
    }
  };

  const switchCamera = async () => {
    const newFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(newFacing);
    
    if (scanningState === 'scanning') {
      stopScanning();
      setTimeout(() => startCameraScanning(), 500);
    }
  };

  const stopScanning = () => {
    qrScannerRef.current?.stop();
    setScanningState('idle');
    setProgress(0);
    setScanProgress(0);
    setCardDetected(false);
    setErrorMessage("");
  };

  const resetScanner = () => {
    stopScanning();
  };

  useEffect(() => {
    return () => {
      qrScannerRef.current?.stop();
    };
  }, []);

  const getStatusInfo = () => {
    switch (scanningState) {
      case 'initializing': return { text: 'Initializing camera...', color: 'bg-blue-500', icon: '📷' };
      case 'scanning': return { text: 'Looking for QR code...', color: 'bg-primary animate-pulse', icon: '🔍' };
      case 'card-detected': return { text: 'Card detected! Reading...', color: 'bg-yellow-500 animate-pulse', icon: '📱' };
      case 'processing': return { text: 'Processing QR data...', color: 'bg-orange-500', icon: '⚡' };
      case 'success': return { text: 'QR Code Successfully Read!', color: 'bg-green-500', icon: '✅' };
      case 'error': return { text: 'Scanner error', color: 'bg-red-500', icon: '❌' };
      default: return { text: 'Ready to scan', color: 'bg-muted', icon: '📷' };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Enhanced Header */}
      <header className="bg-gradient-header text-white shadow-medical relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                stopScanning();
                onCancel();
              }}
              className="text-white hover:bg-white/15 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Smart QR Scanner
              </h1>
              <p className="text-xs text-white/80">Swasthya Saathi Medical System</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Dr. Rajeev Nair</p>
                <p className="text-xs text-white/80">Primary Health Center</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner Interface */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
              {/* Status Bar */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${scanningState !== 'idle' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-sm font-medium">
                      Camera {scanningState !== 'idle' ? 'ACTIVE' : 'STANDBY'}
                    </span>
                    <Badge className={`${status.color} text-white text-xs px-2 py-1`}>
                      {status.icon} {status.text}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <span>HD</span>
                  </div>
                </div>
                
                {/* Progress Indicators */}
                {scanningState === 'initializing' && (
                  <div className="mt-3">
                    <Progress value={progress} className="h-1 bg-slate-700" />
                  </div>
                )}
                
                {scanningState === 'scanning' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Scan Progress</span>
                      <span>{Math.round(scanProgress)}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-1 bg-slate-700" />
                  </div>
                )}
              </div>

              <CardContent className="p-0">
                {/* Camera Display */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className={`w-full h-full object-cover ${
                      scanningState === 'scanning' || scanningState === 'card-detected' || scanningState === 'processing' || scanningState === 'success' ? 'block' : 'hidden'
                    }`}
                    playsInline
                    muted
                  />

                  {/* Camera Placeholder */}
                  {scanningState === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/70">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Camera Ready</p>
                        <p className="text-sm opacity-75">Click "Start Scanning" to begin</p>
                      </div>
                    </div>
                  )}

                  {/* Scanning Overlay */}
                  {(scanningState === 'scanning' || scanningState === 'card-detected' || scanningState === 'processing' || scanningState === 'success') && (
                    <div className="absolute inset-0">
                      {/* Scanning Frame */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className={`w-64 h-64 border-2 rounded-xl transition-all duration-500 ${
                          scanningState === 'success' ? 'border-green-400 shadow-green-400/50 shadow-2xl' :
                          scanningState === 'card-detected' || scanningState === 'processing' ? 'border-yellow-400 shadow-yellow-400/50 shadow-xl animate-pulse' :
                          'border-primary shadow-primary/30 shadow-lg'
                        }`}>
                          
                          {/* Enhanced Corner Brackets */}
                          {[
                            { pos: '-top-2 -left-2', corners: 'border-t-4 border-l-4 rounded-tl-xl' },
                            { pos: '-top-2 -right-2', corners: 'border-t-4 border-r-4 rounded-tr-xl' },
                            { pos: '-bottom-2 -left-2', corners: 'border-b-4 border-l-4 rounded-bl-xl' },
                            { pos: '-bottom-2 -right-2', corners: 'border-b-4 border-r-4 rounded-br-xl' }
                          ].map((bracket, i) => (
                            <div 
                              key={i}
                              className={`absolute ${bracket.pos} w-8 h-8 ${bracket.corners} transition-all duration-300 ${
                                scanningState === 'success' ? 'border-green-400' :
                                scanningState === 'card-detected' || scanningState === 'processing' ? 'border-yellow-400' :
                                'border-primary'
                              }`} 
                            />
                          ))}
                          
                          {/* Scanning Animation */}
                          {scanningState === 'scanning' && (
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-ping" 
                                   style={{ top: `${(scanProgress % 100)}%` }} />
                            </div>
                          )}
                          
                          {/* Card Detection Effect */}
                          {scanningState === 'card-detected' && (
                            <div className="absolute inset-0 rounded-xl">
                              <div className="absolute inset-4 border-2 border-yellow-400 rounded-lg animate-ping opacity-75" />
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-yellow-400/20 px-3 py-1 rounded-full">
                                  <span className="text-yellow-400 text-sm font-medium">📱 Card Detected</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Success Animation */}
                          {scanningState === 'success' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-green-500/20 p-6 rounded-full animate-pulse">
                                <CheckCircle className="h-12 w-12 text-green-400" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Corner Indicators */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between">
                        <Badge className="bg-black/50 text-white">
                          {cameraFacing === 'environment' ? '📷 Back Camera' : '🤳 Front Camera'}
                        </Badge>
                        <Badge className="bg-black/50 text-white">
                          {flashEnabled ? '💡 Flash ON' : '🔦 Flash OFF'}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {scanningState === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                        <p className="text-lg font-medium">Camera Error</p>
                        <p className="text-sm opacity-75">Please check permissions</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Control Panel */}
                <div className="p-6 bg-gradient-to-r from-card to-accent/5">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {scanningState === 'idle' && (
                      <>
                        <Button
                          onClick={startCameraScanning}
                          className="bg-gradient-medical hover:bg-primary-dark px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                          size="lg"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Start Scanning
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 hover:bg-accent transition-all duration-200"
                          size="lg"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Upload Image
                        </Button>
                      </>
                    )}

                    {(scanningState === 'scanning' || scanningState === 'card-detected' || scanningState === 'processing' || scanningState === 'success') && (
                      <>
                        <Button
                          onClick={resetScanner}
                          variant="outline"
                          className="px-6"
                          size="lg"
                        >
                          <RefreshCw className="h-5 w-5 mr-2" />
                          Stop
                        </Button>
                        
                        <Button
                          onClick={toggleFlash}
                          variant="outline"
                          className="px-4"
                          size="lg"
                        >
                          {flashEnabled ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5" />}
                        </Button>
                        
                        <Button
                          onClick={switchCamera}
                          variant="outline"
                          className="px-4"
                          size="lg"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    {scanningState === 'error' && (
                      <div className="flex gap-3">
                        <Button
                          onClick={startCameraScanning}
                          className="flex-1"
                          size="lg"
                        >
                          <RefreshCw className="h-5 w-5 mr-2" />
                          Retry Camera
                        </Button>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="flex-1"
                          size="lg"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Upload Instead
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Instructions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  📋 Scanning Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { step: '1', title: 'Position Card', desc: 'Hold Swasthya Card steady within frame' },
                    { step: '2', title: 'Good Lighting', desc: 'Ensure QR code is well-lit and clear' },
                    { step: '3', title: 'Wait for Detection', desc: 'Scanner will automatically detect the card' },
                    { step: '4', title: 'OTP Verification', desc: 'Enter patient consent OTP when prompted' }
                  ].map((instruction, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {instruction.step}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{instruction.title}</p>
                        <p className="text-xs text-muted-foreground">{instruction.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scanner Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">🔧 Scanner Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Camera Access</span>
                  <Badge variant={scanningState !== 'idle' ? "default" : "secondary"} className={scanningState !== 'idle' ? "bg-green-500" : ""}>
                    {scanningState !== 'idle' ? '✓ Active' : '○ Standby'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">QR Detection</span>
                  <Badge variant={cardDetected ? "default" : "secondary"} className={cardDetected ? "bg-yellow-500" : ""}>
                    {cardDetected ? '📱 Card Found' : '🔍 Scanning'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Status</span>
                  <Badge variant="default" className="bg-blue-500">
                    🟢 Online
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="shadow-card border-primary/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-primary mb-2">💡 Quick Tip</p>
                  <p className="text-xs text-muted-foreground">
                    For demo purposes, scan any QR code containing "SW001234" to access sample patient record
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Error Display */}
        {errorMessage && (
          <Card className="mt-6 border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive font-medium">{errorMessage}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};