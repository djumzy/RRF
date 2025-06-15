import { useState, useCallback } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CloudUpload, 
  FileText, 
  Image, 
  Video, 
  FileAudio,
  File,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  courseId?: string | number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
  onUploadComplete?: (files: any[]) => void;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function FileUpload({
  courseId,
  maxSize = 50,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.mp4', '.mp3'],
  multiple = true,
  onUploadComplete
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate file upload since we don't have actual file upload endpoint
      // In a real implementation, this would upload to a file storage service
      const response = await apiRequest('POST', `/api/courses/${courseId}/files`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: `uploads/${file.name}`, // This would be the actual uploaded file URL
      });
      
      return response.json();
    },
    onSuccess: (data, file) => {
      setFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'success' as const, progress: 100 }
          : f
      ));
      
      if (courseId) {
        queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'files'] });
      }
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`,
      });
    },
    onError: (error, file) => {
      setFiles(prev => prev.map(f => 
        f.file === file 
          ? { ...f, status: 'error' as const, error: 'Upload failed' }
          : f
      ));
      
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}`,
        variant: "destructive",
      });
    },
  });

  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type.startsWith('image/')) {
      return <Image className="h-5 w-5" />;
    } else if (type.startsWith('video/')) {
      return <Video className="h-5 w-5" />;
    } else if (type.startsWith('audio/')) {
      return <FileAudio className="h-5 w-5" />;
    } else if (type.includes('pdf') || type.includes('document')) {
      return <FileText className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };

  const getFileIconColor = (file: File) => {
    const type = file.type;
    
    if (type.startsWith('image/')) {
      return 'text-green-500';
    } else if (type.startsWith('video/')) {
      return 'text-purple-500';
    } else if (type.startsWith('audio/')) {
      return 'text-blue-500';
    } else if (type.includes('pdf')) {
      return 'text-red-500';
    } else if (type.includes('document') || type.includes('word')) {
      return 'text-blue-600';
    } else {
      return 'text-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }
    
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }
    
    return null;
  };

  const handleFileSelect = useCallback((selectedFiles: FileList) => {
    const newFiles: UploadFile[] = [];
    
    Array.from(selectedFiles).forEach(file => {
      const error = validateFile(file);
      
      const uploadFile: UploadFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: error ? 'error' : 'pending',
        error,
      };
      
      newFiles.push(uploadFile);
    });
    
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    
    // Start uploading valid files
    newFiles.forEach(uploadFile => {
      if (uploadFile.status === 'pending') {
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'uploading' as const }
            : f
        ));
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 90) {
            clearInterval(interval);
            uploadMutation.mutate(uploadFile.file);
          } else {
            setFiles(prev => prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, progress }
                : f
            ));
          }
        }, 200);
      }
    });
  }, [multiple, maxSize, acceptedTypes, uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = (uploadFile: UploadFile) => {
    setFiles(prev => prev.map(f => 
      f.id === uploadFile.id 
        ? { ...f, status: 'uploading' as const, error: undefined, progress: 0 }
        : f
    ));
    
    uploadMutation.mutate(uploadFile.file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver 
                ? "border-rrf-green bg-rrf-light-green" 
                : "border-gray-300 hover:border-rrf-green"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Course Resources
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Supports {acceptedTypes.join(', ')} up to {maxSize}MB each
            </p>
            
            <input
              type="file"
              multiple={multiple}
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            
            <Button 
              asChild
              className="bg-rrf-green hover:bg-rrf-dark-green"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Uploading Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((uploadFile) => (
                <div 
                  key={uploadFile.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={cn("flex-shrink-0", getFileIconColor(uploadFile.file))}>
                      {getFileIcon(uploadFile.file)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      
                      {uploadFile.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={uploadFile.progress} className="h-1" />
                        </div>
                      )}
                      
                      {uploadFile.error && (
                        <p className="text-xs text-red-500 mt-1">
                          {uploadFile.error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadFile.status === 'success' && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                    
                    {uploadFile.status === 'error' && (
                      <>
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => retryUpload(uploadFile)}
                        >
                          Retry
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
