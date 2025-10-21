// Google Drive API service for managing CSV file
const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3'
const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3'
const FILE_NAME = 'daily-run-tracker.csv'

export class GoogleDriveService {
  constructor(accessToken) {
    this.accessToken = accessToken
  }

  // Find the CSV file in user's Drive
  async findFile() {
    const response = await fetch(
      `${DRIVE_API_BASE}/files?q=name='${FILE_NAME}' and trashed=false&fields=files(id,name)`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to search for file')
    }

    const data = await response.json()
    return data.files.length > 0 ? data.files[0] : null
  }

  // Load CSV data from Drive
  async loadData() {
    try {
      const file = await this.findFile()

      if (!file) {
        // No file exists yet, return empty data
        return {}
      }

      // Download file content
      const response = await fetch(
        `${DRIVE_API_BASE}/files/${file.id}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download file')
      }

      const csvContent = await response.text()
      return this.parseCSV(csvContent)
    } catch (error) {
      console.error('Error loading data from Drive:', error)
      return {}
    }
  }

  // Save CSV data to Drive
  async saveData(kilometersData) {
    try {
      const csvContent = this.generateCSV(kilometersData)
      const file = await this.findFile()

      if (file) {
        // Update existing file
        await this.updateFile(file.id, csvContent)
      } else {
        // Create new file
        await this.createFile(csvContent)
      }

      return true
    } catch (error) {
      console.error('Error saving data to Drive:', error)
      return false
    }
  }

  // Create new file in Drive
  async createFile(csvContent) {
    const metadata = {
      name: FILE_NAME,
      mimeType: 'text/csv'
    }

    const form = new FormData()
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    )
    form.append('file', new Blob([csvContent], { type: 'text/csv' }))

    const response = await fetch(
      `${UPLOAD_API_BASE}/files?uploadType=multipart`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        },
        body: form
      }
    )

    if (!response.ok) {
      throw new Error('Failed to create file')
    }

    return await response.json()
  }

  // Update existing file in Drive
  async updateFile(fileId, csvContent) {
    const response = await fetch(
      `${UPLOAD_API_BASE}/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'text/csv'
        },
        body: csvContent
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update file')
    }

    return await response.json()
  }

  // Convert kilometers object to CSV string
  generateCSV(kilometersData) {
    let csv = 'Date,Kilometers\n'

    const sortedDates = Object.keys(kilometersData).sort()

    for (const date of sortedDates) {
      csv += `${date},${kilometersData[date]}\n`
    }

    return csv
  }

  // Parse CSV string to kilometers object
  parseCSV(csvContent) {
    const kilometers = {}

    const lines = csvContent.trim().split('\n')

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const [date, km] = line.split(',')
      if (date && km) {
        kilometers[date] = parseFloat(km)
      }
    }

    return kilometers
  }
}

export default GoogleDriveService
