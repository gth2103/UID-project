from app.models import *

def commit_registration(form) :
    user = User(username=(form.username.data).lower(), email=form.email.data)
    user.set_password(form.password.data)
    db.session.add(user)
    db.session.commit()
