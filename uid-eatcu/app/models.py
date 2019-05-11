from app import login_manager, db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, time, date, timedelta

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


    def __repr__(self):
        return '<User %r>' % self.username


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), index=True, nullable=False)
    place_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(32), nullable=False)
    date = db.Column(db.Date, index=True, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    notes = db.Column(db.Text)
    position = db.Column(db.Text)
    address = db.Column(db.String(50))
    user = db.relationship("User", foreign_keys=[user_id], backref=db.backref("events", cascade="all,delete"))

    

    def serialize(self):
        return {
            'id': self.id,
            'place_id': self.place_id,
            'title': self.title,
            'date': self.date,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'notes': self.notes,
            'address': self.address,
            'position': self.position,
            'user_id': self.user_id
    
        }

class UserEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), index=True, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), index=True, nullable=False)
    accepted = db.Column(db.Boolean, default=False, nullable=False)
    user = db.relationship("User", foreign_keys=[user_id], backref=db.backref("user_events", cascade="all,delete"))
    event = db.relationship("Event", foreign_keys=[event_id], backref=db.backref("user_events", cascade="all,delete"))

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'accepted': self.accepted
        }

class EventInvitation(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), index=True, nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), index=True, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), index=True, nullable=False)
    sender = db.relationship("User", foreign_keys=[sender_id], backref=db.backref("sent_invitations", cascade="all,delete"))
    receiver = db.relationship("User", foreign_keys=[receiver_id], backref=db.backref("received_invitations", cascade="all,delete"))
    event = db.relationship("Event", foreign_keys=[event_id], backref=db.backref("invitations", cascade="all,delete"))


#db.drop_all()
db.create_all()
