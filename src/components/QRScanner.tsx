import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Camera, AlertCircle, RefreshCw, Upload } from "lucide-react";
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (qrData: string) => void;
  onCancel: () => void;
}

export const QRScanner = ({ onScan, onCancel }: QRScannerProps) => {
  const [scanningState, setScanningState] = useState<'idle' | 'initializing' | 'scanning' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const startCameraScanning = async () => {
    try {
      setScanningState('initializing');
      setProgress(10);
      setErrorMessage("");

      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      setProgress(30);
      
      // Create QR Scanner instance
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          setScanningState('idle');
          setProgress(100);
          qrScannerRef.current?.stop();
          onScan(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      // Start scanning
      await qrScannerRef.current.start();
      setScanningState('scanning');
      setProgress(60);

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
      setScanningState('initializing');
      setProgress(30);
      setErrorMessage("");

      const result = await QrScanner.scanImage(file);
      setProgress(100);
      setScanningState('idle');
      onScan(result);
    } catch (error) {
      console.error('QR scan error:', error);
      setScanningState('error');
      setErrorMessage("No QR code found in the uploaded image. Please try again.");
      setProgress(0);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const stopScanning = () => {
    qrScannerRef.current?.stop();
    setScanningState('idle');
    setProgress(0);
    setErrorMessage("");
  };

  const resetScanner = () => {
    stopScanning();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      qrScannerRef.current?.stop();
    };
  }, []);

  const getStatusText = () => {
    switch (scanningState) {
      case 'initializing': return 'Initializing camera...';
      case 'scanning': return 'Scanning for QR code...';
      case 'error': return 'Scanner error';
      default: return 'Ready to scan';
    }
  };

  const getStatusColor = () => {
    switch (scanningState) {
      case 'error': return 'destructive';
      case 'scanning': case 'initializing': return 'secondary';
      default: return 'outline';
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
              size="sm"
              onClick={() => {
                stopScanning();
                onCancel();
              }}
              className="text-white hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold">QR Code Scanner</h1>
              <p className="text-xs text-white/80">Scan Patient Card</p>
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

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-primary">
              <Camera className="h-6 w-6" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Position the patient's Swasthya Card QR code within the camera frame
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Scanner View */}
            <div className="relative">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Video Element for Camera */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover rounded-lg ${
                    scanningState === 'scanning' ? 'block' : 'hidden'
                  }`}
                  playsInline
                  muted
                />

                {/* Placeholder when camera is not active */}
                {scanningState !== 'scanning' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-center text-muted-foreground">
                      <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Camera will appear here</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Click "Start Camera" to begin scanning
                      </p>
                    </div>
                  </div>
                )}

                {/* Scanning Overlay */}
                {scanningState === 'scanning' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg">
                      {/* Corner Brackets */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br" />
                    </div>
                  </div>
                )}
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

            {/* Status and Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={getStatusColor() as any} className="text-sm">
                  {getStatusText()}
                </Badge>
                {(scanningState === 'initializing') && (
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                )}
              </div>

              {scanningState === 'initializing' && (
                <Progress value={progress} className="h-2" />
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {scanningState === 'idle' && (
                <>
                  <Button
                    onClick={startCameraScanning}
                    className="w-full h-12 bg-gradient-medical hover:bg-primary-dark"
                    size="lg"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Start Camera
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-12"
                    size="lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload QR Image
                  </Button>
                </>
              )}

              {(scanningState === 'scanning' || scanningState === 'initializing') && (
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="w-full h-12"
                  size="lg"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Stop Scanning
                </Button>
              )}

              {scanningState === 'error' && (
                <div className="flex gap-3">
                  <Button
                    onClick={startCameraScanning}
                    className="flex-1 h-12"
                    size="lg"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Try Camera Again
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 h-12"
                    size="lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Image
                  </Button>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-accent/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Scanning Instructions:</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>• Position the QR code within the scanning frame</li>
                <li>• Hold the card steady and ensure good lighting</li>
                <li>• For sample testing, scan QR code with text "SW001234"</li>
                <li>• Patient consent will be requested after successful scan</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};