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
	events = db.session.query(Event).join(UserEvent, UserEvent.event_id == Event.id).filter(UserEvent.user_id == user_id, UserEvent.accepted == 1, Event.date >= today).order_by(asc(Event.date), asc(Event.start_time)).limit(10).all()
	return events
