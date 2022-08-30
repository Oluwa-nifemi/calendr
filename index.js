/*
  * Features
  * - Render calendar
  * - Zoom calendar to increase ticks (10 - 11 becomes 10 - 10:30 - 11 becomes 10 - 10:15 - 10:30 - 10:45 - 11)
  * - Allow expand event and it should snap to the grid lines
  * - Create event and it should be saved to the dummy database
  * - Find free lanes on create
  * */


const intervalsElement = document.querySelector('.intervals');
const rootElement = document.documentElement;

let MINIMUM_INTERVAL = 15;
let CURRENT_INTERVAL = 60; //minutes
const LENGTH_OF_WORK_DAY = 12 * 60;

const zoomButtons = [...document.querySelectorAll('.zoom-buttons button')];

zoomButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const direction = e.target.dataset.direction;

    const factor = direction === "minus" ? 2 : 0.5;

    CURRENT_INTERVAL = CURRENT_INTERVAL * factor;
    CURRENT_INTERVAL = Math.max(CURRENT_INTERVAL, MINIMUM_INTERVAL);
    CURRENT_INTERVAL = Math.min(CURRENT_INTERVAL, 240);

    renderDays()
  })
})

const startTime = new Date();
startTime.setHours(10);
startTime.setMinutes(0, 0, 0);

const getColumnStart = (time) => {
  const distanceInMilliseconds = time.getTime() - startTime.getTime();
  const distanceInMinutes = distanceInMilliseconds / 60000;
  return distanceInMinutes / MINIMUM_INTERVAL;
}

const getIntervalElement = (time) => {
  const hour = time.getHours();
  const AM_OR_PM = hour >= 12 ? 'PM' : 'AM';

  let text = `${hour}:${String(time.getMinutes()).padEnd(2, '0')} ${AM_OR_PM}`;

  if(CURRENT_INTERVAL >= 60) {
    text = `${hour} ${AM_OR_PM}`
  }

  const intervalElement = document.createElement('p');
  intervalElement.innerText = text;

  const columnStart = getColumnStart(time) + 1;

  intervalElement.style.gridColumnStart = String(columnStart);

  return intervalElement;
}

const renderDays = () => {
  intervalsElement.innerHTML = ''

  const time = new Date();
  time.setHours(10);
  time.setMinutes(0, 0, 0);

  const numIntervals = LENGTH_OF_WORK_DAY / CURRENT_INTERVAL;

  rootElement.style.setProperty('--number-of-columns', String(numIntervals));

  Array.from({length: numIntervals}).forEach(() => {
    const element = getIntervalElement(time);
    intervalsElement.append(element);
    time.setMinutes(time.getMinutes() + CURRENT_INTERVAL);
  })
}

//Reservation schema
/*
* {
*   id: string
*   name: string
*   numberOfGuest: 10
*   startTime: Date
*   date: Date
*   duration: int
*   lanes: [int]
* }
*
* */

const today = new Date()

const reservations = [
  {
    id: '1',
    name: 'John Doe',
    numberOfGuest: 10,
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
    date: new Date(2020, 0, 1),
    duration: 90,
    lanes: [1, 2, 3]
  },
  {
    id: '2',
    name: 'Jay jeans',
    numberOfGuest: 10,
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30),
    date: new Date(2020, 0, 1),
    duration: 120,
    lanes: [4, 6, 7]
  },
  {
    id: '3',
    name: 'Jones',
    numberOfGuest: 6,
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 30),
    date: new Date(2020, 0, 1),
    duration: 60,
    lanes: [4, 5]
  },
]

const renderReservations = () => {
  const reservationsElement = document.querySelector('.calendar');
  reservationsElement.innerHTML = '';
  reservations.forEach(reservation => {
    reservation.lanes.forEach(lane => {
      const reservationElement = document.createElement('div');
      reservationElement.classList.add('reservation');

      reservationElement.innerText = `${reservation.name} - ${reservation.numberOfGuest}`;

      const time = new Date();
      time.setHours(reservation.startTime);
      time.setMinutes(0, 0, 0);

      const columnStart = getColumnStart(reservation.startTime) + 1;
      const columnSpan = reservation.duration / MINIMUM_INTERVAL;

      reservationElement.style.gridColumnStart = `${columnStart}`;
      reservationElement.style.gridColumnEnd = `span ${columnSpan}`;
      reservationElement.style.gridRowStart = `${lane}`;

      reservationsElement.append(reservationElement);

    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  rootElement.style.setProperty('--grid-per-day', String(LENGTH_OF_WORK_DAY / MINIMUM_INTERVAL))
  renderDays()
  renderReservations()
})
