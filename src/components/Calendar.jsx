import { useState, useEffect } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns'
import './Calendar.css'

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [kilometers, setKilometers] = useState({})
  const [editingDate, setEditingDate] = useState(null)
  const [inputValue, setInputValue] = useState('')

  // Calculate monthly total
  const getMonthlyTotal = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    let total = 0

    Object.keys(kilometers).forEach(dateStr => {
      const date = new Date(dateStr)
      if (date >= monthStart && date <= monthEnd) {
        total += kilometers[dateStr] || 0
      }
    })

    return total
  }

  const handleKmClick = (date, km) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    setEditingDate(dateStr)
    setInputValue(km ? km.toString() : '')
  }

  const handleKmSave = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const value = parseFloat(inputValue)

    if (!isNaN(value) && value >= 0) {
      setKilometers(prev => ({
        ...prev,
        [dateStr]: value
      }))
    } else if (inputValue === '') {
      const newKm = { ...kilometers }
      delete newKm[dateStr]
      setKilometers(newKm)
    }

    setEditingDate(null)
    setInputValue('')
  }

  const renderHeader = () => {
    const monthlyTotal = getMonthlyTotal()

    return (
      <div className="calendar-header">
        <button
          className="nav-button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          ‹
        </button>
        <div className="header-center">
          <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
          <div className="monthly-total">
            Total: <span className="total-km">{monthlyTotal.toFixed(1)} km</span>
          </div>
        </div>
        <button
          className="nav-button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          ›
        </button>
      </div>
    )
  }

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
      <div className="days-row">
        {days.map((day, index) => (
          <div key={index} className="day-name">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const dateStr = format(day, 'yyyy-MM-dd')
        const km = kilometers[dateStr]
        const isEditing = editingDate === dateStr

        days.push(
          <div
            key={day}
            className={`calendar-cell ${
              !isSameMonth(day, monthStart) ? 'disabled' : ''
            } ${isSameDay(day, selectedDate) ? 'selected' : ''} ${
              isToday(day) ? 'today' : ''
            } ${km ? 'has-km' : ''}`}
          >
            <span className="date-number">{format(day, 'd')}</span>
            {isSameMonth(day, monthStart) && (
              <div className="km-input-container">
                {isEditing ? (
                  <input
                    type="number"
                    className="km-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={() => handleKmSave(cloneDay)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleKmSave(cloneDay)
                      }
                    }}
                    autoFocus
                    placeholder="km"
                  />
                ) : (
                  <div
                    className="km-display"
                    onClick={() => handleKmClick(cloneDay, km)}
                  >
                    {km ? `${km} km` : '+'}
                  </div>
                )}
              </div>
            )}
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day} className="calendar-row">
          {days}
        </div>
      )
      days = []
    }

    return <div className="calendar-body">{rows}</div>
  }

  return (
    <div className="calendar-container">
      <div className="calendar">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  )
}

export default Calendar
