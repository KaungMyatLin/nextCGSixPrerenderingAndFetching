import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import { getAllEvents } from '../../helpers/api-util';
import useSWR from 'swr';
import Head from 'next/head'
function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState()
  const router = useRouter();
  const filterData = router.query.slug;
  const {data, error} = useSWR('https://nextcgsixprerendering-fetching-default-rtdb.asia-southeast1.firebasedatabase.app/events.json');
  useEffect(() => {
    if (data) {
      const events = []
      for (const key in data) {
          events.push({
              id: key,
              ...data[key]
          })
      }
      setLoadedEvents(events)
    }
  }, [data])
  let pageHeadData = (
    <Head>
    <title> Filtered events </title>
    <meta name="description" content='a list of filtered events' />
    </Head>
  )
  if (!loadedEvents) {
    return (
    <Fragment>
      {pageHeadData}
      <p className='center'>Loading...</p>
    </Fragment>
  )}
  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];
  const numYear = +filteredYear;
  const numMonth = +filteredMonth;
  pageHeadData = (
    <Head>
      <title> Filtered events </title>
      <meta name="description" content={`All events for ${numMonth}/${numYear}.`} />
    </Head>
  )
  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12 || error
  ) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </Fragment>
    );
  }
  const filteredEvents = loadedEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
  });
  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}
// export async function getServerSideProps (context) {
//   const {params} = context;
//   const filterData = params.slug;
//   const filteredYear = filterData[0];
//   const filteredMonth = filterData[1];

//   const numYear = +filteredYear;
//   const numMonth = +filteredMonth;

//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2030 ||
//     numYear < 2021 ||
//     numMonth < 1 ||
//     numMonth > 12
//   ) {
//     return {
//       // notFound: true,
//       // redirect: {
//       //   destination: '/error'
//       // }
//       props: {hasError: true}
//     }
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth,
//   });
//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         numYear: numYear,
//         numMonth: numMonth
//       }
//     }
//   }
// }
// async function getFilteredEvents(dateFilter) {
//   const { year, month } = dateFilter;
//   const allEvent = await getAllEvents();
//   let filteredEvents = allEvent.filter((event) => {
//     const eventDate = new Date(event.date);
//     return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
//   });
//   return filteredEvents;
// }

export default FilteredEventsPage;
