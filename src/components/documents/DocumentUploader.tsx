import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileCheck, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DocumentUploaderProps {
  onUpload: (files: File[]) => void
  acceptedFormats?: string[]
  maxSize?: number
}

export default function DocumentUploader({
  onUpload,
  acceptedFormats = ['.pdf', '.xlsx', '.csv', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024 // 10MB
}: DocumentUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => ({
      ...acc,
      [`application/${format.replace('.', '')}`]: [format]
    }), {}),
    maxSize
  })

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles)
      setSelectedFiles([])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-neutral-border dark:border-neutral-700 hover:border-primary hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-text-secondary" />
            {isDragActive ? (
              <p className="text-lg text-primary font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium text-neutral-text-primary dark:text-neutral-100 mb-2">
                  Drag & drop documents here, or click to browse
                </p>
                <p className="text-sm text-neutral-text-secondary dark:text-neutral-400">
                  Supported formats: {acceptedFormats.join(', ')} (Max {maxSize / 1024 / 1024}MB)
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-neutral-text-primary dark:text-neutral-100">
                Selected Files ({selectedFiles.length})
              </h4>
              <Button onClick={handleUpload} size="sm">
                <FileCheck className="w-4 h-4 mr-2" />
                Upload All
              </Button>
            </div>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutral-bg dark:bg-neutral-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
