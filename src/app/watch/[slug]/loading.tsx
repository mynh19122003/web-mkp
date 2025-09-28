import LoadingSpinner from '@/components/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LoadingSpinner 
        size="large" 
        text="Đang tải video..." 
      />
    </div>
  )
}