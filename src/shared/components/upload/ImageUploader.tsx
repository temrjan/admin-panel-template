import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { apiClient } from '@/shared/api'

export interface UploadedImage {
  url: string
  filename: string
}

interface ImageUploaderProps {
  value?: string[]  // Array of image URLs
  onChange?: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number  // in MB
  disabled?: boolean
}

export const ImageUploader = ({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5,
  disabled = false,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.post<UploadedImage>(
        '/uploads/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data.url
    } catch (err) {
      console.error('Upload failed:', err)
      return null
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return

      setError(null)
      setUploading(true)

      try {
        const remainingSlots = maxFiles - value.length
        const filesToUpload = acceptedFiles.slice(0, remainingSlots)

        if (filesToUpload.length < acceptedFiles.length) {
          setError(`Можно загрузить максимум ${maxFiles} изображений`)
        }

        const uploadPromises = filesToUpload.map((file) => uploadImage(file))
        const uploadedUrls = await Promise.all(uploadPromises)

        const successfulUrls = uploadedUrls.filter(
          (url): url is string => url !== null
        )

        if (successfulUrls.length > 0 && onChange) {
          onChange([...value, ...successfulUrls])
        }

        if (successfulUrls.length < filesToUpload.length) {
          setError('Некоторые файлы не удалось загрузить')
        }
      } finally {
        setUploading(false)
      }
    },
    [value, onChange, maxFiles, disabled]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxSize: maxSize * 1024 * 1024,
    disabled: disabled || value.length >= maxFiles,
    multiple: true,
  })

  const removeImage = (index: number) => {
    if (disabled || !onChange) return
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const canUploadMore = value.length < maxFiles

  return (
    <div className="space-y-4">
      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded">
                  Основное
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      {canUploadMore && !disabled && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50',
            uploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Загрузка изображений...
                </p>
              </>
            ) : isDragActive ? (
              <>
                <Upload className="w-12 h-12 text-primary" />
                <p className="text-sm font-medium">Отпустите для загрузки</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Перетащите изображения сюда
                </p>
                <p className="text-xs text-muted-foreground">
                  или нажмите для выбора файлов
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  До {maxFiles} файлов, макс. {maxSize}MB каждый
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive border border-destructive/50 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Info Message */}
      {value.length >= maxFiles && (
        <div className="text-sm text-muted-foreground border border-border rounded-lg p-3">
          Достигнуто максимальное количество изображений ({maxFiles})
        </div>
      )}
    </div>
  )
}
