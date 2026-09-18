function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function uploadPdf(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ dataUrl: string }> {
  if (file.size > 750 * 1024) {
    throw new Error('File too large. Maximum size is 750 KB for Firestore storage.')
  }

  onProgress?.(30)
  const dataUrl = await fileToBase64(file)
  onProgress?.(100)

  return { dataUrl }
}

export async function deletePdf(_path: string) {
  // No-op: PDFs are stored in Firestore documents, deleted with the document
}
