import { useState } from 'react';

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS  = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const CRENEAUX = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00','18:00'];

function startOfMonth(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function timeToMins(heure) {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
}

// Returns true if `heure` on `dateKey` is covered by any reservation
function isBooked(dateKey, heure, reservations) {
  const slotStart = timeToMins(heure);
  return reservations.some((r) => {
    if (r.dateKey !== dateKey) return false;
    const resStart = timeToMins(r.heure);
    const resEnd   = resStart + (r.duration_mins ?? 60);
    return slotStart >= resStart && slotStart < resEnd;
  });
}

export default function Calendar({ onSelect, reservations = [] }) {
  const today = new Date();
  const [year,  setYear]    = useState(today.getFullYear());
  const [month, setMonth]   = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const [pickedDay, setPickedDay] = useState(null);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setPickedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setPickedDay(null);
  };

  const offset = startOfMonth(year, month);
  const days   = daysInMonth(year, month);
  const cells  = Array(offset).fill(null).concat(Array.from({ length: days }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) => d && toKey(year, month, d) === toKey(today.getFullYear(), today.getMonth(), today.getDate());
  const isPast  = (d) => d && new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const handleDayClick = (d) => {
    if (!d || isPast(d)) return;
    const key = toKey(year, month, d);
    setPickedDay(key === pickedDay ? null : key);
  };

  const handleCreneauClick = (heure) => {
    if (isBooked(pickedDay, heure, reservations)) return;
    const s = { dateKey: pickedDay, heure };
    setSelected(s);
    onSelect?.(s);
  };

  const selectedDateStr = pickedDay
    ? new Date(pickedDay + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>‹</button>
        <span className="cal-title">{MOIS[month]} {year}</span>
        <button className="cal-nav" onClick={nextMonth}>›</button>
      </div>

      <div className="cal-grid">
        {JOURS.map(j => <div key={j} className="cal-day-label">{j}</div>)}
        {cells.map((d, i) => {
          const key    = d ? toKey(year, month, d) : null;
          const past   = isPast(d);
          const picked = key === pickedDay;
          return (
            <div
              key={i}
              className={`cal-cell${isToday(d) ? ' cal-today' : ''}${past ? ' cal-past' : ''}${picked ? ' cal-picked' : ''}${d ? ' cal-day' : ''}`}
              onClick={() => handleDayClick(d)}
            >
              {d && <span className="cal-num">{d}</span>}
            </div>
          );
        })}
      </div>

      {pickedDay && (
        <div className="cal-slots">
          <p className="cal-slots-title">
            Créneaux disponibles — <strong>{selectedDateStr}</strong>
          </p>
          <div className="cal-slots-grid">
            {CRENEAUX.map(h => {
              const booked = isBooked(pickedDay, h, reservations);
              const active = !booked && selected?.dateKey === pickedDay && selected?.heure === h;
              return (
                <button
                  key={h}
                  disabled={booked}
                  className={`cal-slot${active ? ' cal-slot-active' : ''}${booked ? ' cal-slot-booked' : ''}`}
                  onClick={() => handleCreneauClick(h)}
                  title={booked ? 'Créneau déjà réservé' : ''}
                >
                  {h}
                  {booked && <span className="cal-slot-icon"> 🔒</span>}
                </button>
              );
            })}
          </div>
          {selected?.dateKey === pickedDay && (
            <p className="cal-selected-note">
              ✓ Créneau sélectionné : <strong>{selectedDateStr}</strong> à <strong>{selected.heure}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

