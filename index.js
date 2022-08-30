/*
  * Features
  * - Render calendar
  * - Zoom calendar to increase ticks (10 - 11 becomes 10 - 10:30 - 11 becomes 10 - 10:15 - 10:30 - 10:45 - 11)
  * - Allow expand event and it should snap to the grid lines
  * - Create event and it should be saved to the dummy database
  * - Find free lanes on create
  * */
//Reservation schema
/*
* {
*   id: string
*   name: string
*   numberOfGuest: 10
*   startTime: Date
*   date: Date
*   duration: int
*   lanes?
* }
*
* */

const intervalsElement = document.querySelector('.intervals');
const rootElement = document.documentElement;

let CURRENT_INTERVAL = 60; //minutes
const LENGTH_OF_WORK_DAY = 12 * 60;

const zoomButtons = [...document.querySelectorAll('.zoom-buttons button')];


zoomButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const direction = e.target.dataset.direction;

    const factor = direction === "minus" ? 2 : 0.5;

    CURRENT_INTERVAL = CURRENT_INTERVAL * factor;
    CURRENT_INTERVAL = Math.max(CURRENT_INTERVAL, 15);
    CURRENT_INTERVAL = Math.min(CURRENT_INTERVAL, 240);

    renderDays()
  })
})

const getIntervalElement = (time) => {
  const hour = time.getHours();
  const AM_OR_PM = hour >= 12 ? 'PM' : 'AM';

  const hourString = hour > 12 ? hour - 12 : hour;

  let text = `${hourString}:${time.getMinutes()} ${AM_OR_PM}`;

  if(CURRENT_INTERVAL >= 60) {
    text = `${hourString} ${AM_OR_PM}`
  }

  const intervalElement = document.createElement('p');
  intervalElement.innerText = text;

  return intervalElement;
}

const renderDays = () => {
  intervalsElement.innerHTML = ''

  const time = new Date();
  time.setHours(10);
  time.setMinutes(0, 0, 0);

  const numIntervals = LENGTH_OF_WORK_DAY / CURRENT_INTERVAL;

  rootElement.style.setProperty('--number-of-columns', String(numIntervals));

  Array.from({length: numIntervals}).forEach((_, i) => {
    const element = getIntervalElement(time);
    intervalsElement.append(element);
    time.setMinutes(time.getMinutes() + CURRENT_INTERVAL);
  })
}

renderDays()