from app import db
from app.models import *
from sqlalchemy import asc


def add_event(event):
	db.session.add(event)
	db.session.commit()

def add_user_event(event, current_user):
	user_event = UserEvent(user_id=current_user.id, event_id=event.id, accepted=True)
	db.session.add(user_event)
	db.session.commit()

def get_recent_events(user_id):
	today = datetime.now()
	week  = timedelta(days=7)
	lastWeek = today - week
	events = db.session.query(Event).join(UserEvent, UserEvent.event_id == Event.id).filter(UserEvent.user_id == user_id, UserEvent.accepted == 1, Event.date >= lastWeek).order_by(asc(Event.date), asc(Event.start_time)).all()
	return events

def send_invite(event, current_user, user):
	sender = UserEvent(user_id=current_user.id, event_id=event.id, accepted=True)
	receiver = UserEvent(user_id=user.id, event_id=event.id)
	db.session.add(sender)
	db.session.add(receiver)
	event_invitation = EventInvitation(sender_id=current_user.id, receiver_id=user.id, event_id=event.id)
	db.session.add(event_invitation)
	db.session.commit()


def get_pending_invites(user_id):
	today = datetime.now()
	week  = timedelta(days=7)
	lastWeek = today - week
	events = db.session.query(Event).join(UserEvent, UserEvent.event_id == Event.id).filter(UserEvent.user_id == user_id, UserEvent.accepted == 1, Event.date >= lastWeek).order_by(asc(Event.date), asc(Event.start_time)).limit(10).all()
	return events

def get_invited(user_id):
	today = datetime.now()
	week  = timedelta(days=7)
	lastWeek = today - week
	events = db.session.query(Event).join(UserEvent, UserEvent.event_id == Event.id).filter(UserEvent.user_id == user_id, UserEvent.accepted == 1, Event.date >= lastWeek).order_by(asc(Event.date), asc(Event.start_time)).limit(10).all()
	return events


