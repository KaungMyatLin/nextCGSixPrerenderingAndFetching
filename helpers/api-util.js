export async function getAllEvents() {
    const resp = await fetch('https://nextcgsixprerendering-fetching-default-rtdb.asia-southeast1.firebasedatabase.app/events.json');
    const datajson = await resp.json();

    const events = []
    for (const key in datajson) {
        events.push({
            id: key,
            ...datajson[key]
        })
    }
    return events
}
export async function getFeaturedEvents() {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => event.isFeatured);
}

export async function getEventById(id) {
    const allEvents = await getAllEvents();
    return allEvents.find((event) => event.id === id);
}
export async function getFilteredEvents(dateFilter) {
    const { year, month } = dateFilter;
    const allEvent = await getAllEvents();
    let filteredEvents = allEvent.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
    });
    return filteredEvents;
}