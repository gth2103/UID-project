from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, SelectField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo, Length
from app.models import *
from wtforms.fields.html5 import DateField
from wtforms_components import DateTimeField

class LoginForm(FlaskForm):
	username = StringField('Username', validators=[DataRequired()])
	password = PasswordField('Password', validators=[DataRequired()])
	remember_me = BooleanField('Remember Me')
	submit = SubmitField('Sign In')


class RegistrationForm(FlaskForm):
	username = StringField('Username', validators=[DataRequired()])
	email = StringField('Email', validators=[DataRequired(), Email()])
	password = PasswordField('Password', validators=[DataRequired()])
	password_repeat = PasswordField(
		'Repeat Password', validators=[DataRequired(), EqualTo('password')])
	submit = SubmitField('Register')

	def validate_username(self, username):
		user = User.query.filter_by(username=username.data).first()
		if user is not None:
			raise ValidationError('Please use a different username.')

	def validate_email(self, email):
		user = User.query.filter_by(email=email.data).first()
		if user is not None:
			raise ValidationError('Please use a different email address.')

class EmailForm(FlaskForm):
	message = TextAreaField('Message', validators=[Length(min=0, max=1000)])
	recipient_email = StringField('Email', validators=[DataRequired(), Email()])
	submit = SubmitField('Email')

class EventForm(FlaskForm):
	place_id  = StringField('Place Id',validators=[DataRequired()])
	title = StringField('Title', validators=[DataRequired()])
	address = StringField('address',validators=[DataRequired()])
	date = DateTimeField('Date', format='%Y-%m-%d', validators=[DataRequired()], render_kw={"placeholder": "yyyy-mm-dd"})
	start_time = DateTimeField('Start Time', validators=[DataRequired()], render_kw={"placeholder": "hh:mm"})
	end_time = DateTimeField('End Time', validators=[DataRequired()], render_kw={"placeholder": "hh:mm"})
	notes = TextAreaField('Notes', validators=[Length(min=0, max=140)])
	submit = SubmitField('Send')
