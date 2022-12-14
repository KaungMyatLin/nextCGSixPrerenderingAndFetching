import { Fragment } from 'react';
import Head from 'next/head'
import { getEventById, getFeaturedEvents } from '../../helpers/api-util';
import EventSummary from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import ErrorAlert from '../../components/ui/error-alert';

function EventDetailPage(props) {
  const event = props.aEvent

  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <Head>
        <title> {event.title} </title>
        <meta name="description" content={event.description} />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}

export async function getStaticProps (context) {
  const eventId = context.params.eventId;
  const event = await getEventById(eventId);
  return {
    props: {
      aEvent: event
    },
    revalidate: 30
  }
}
export async function getStaticPaths (context) {
  const fEvents = await getFeaturedEvents();
  const paramsPaths = fEvents.map( e => ({params: {eventId: e.id}}));
  return {
    paths: paramsPaths,
    fallback: 'blocking'
  }
}
export default EventDetailPage;
