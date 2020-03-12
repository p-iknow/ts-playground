type Weekday = 'Mon' | 'Tue'| 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

let nextDay1: Record<Weekday, Day> = {
	Mon: 'Tue',
}

let nextDay2: Record<Weekday, Day> = {
	Mon: 'Tue',
	Tue: 'Wed',
	Wed: 'Thu',
	Thu: 'Fri',
	Fri: 'Mon'
}