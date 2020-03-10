type Weekday = 'Mon' | 'Tue'| 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

// catchall return 이 없기 때문에 오류가 나야하지만 오류가 나지 않음 추후 살펴봐야함
function getNextDay(w: Weekday): Day {
  switch (w) {
    case 'Mon': return 'Tue'
  }
}

// 100 이하에 대한 처리가 없기 때문에 오류기 니야하지만 오류가 나지 않음
function isBig(n: number) {
  if (n >= 100) {
    return true
  }
}


getNextDay('Tue');