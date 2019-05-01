from app import app, db
from app.models import *

#admin = User(username='admin', email='gth2103@columbia.edu', password_hash=generate_password_hash('admin'))
#guest = User(username='guest', email='guest@columbia.edu', password_hash=generate_password_hash('guest'))

#db.session.add(admin)
#db.session.add(guest)
#db.session.commit()


if __name__ == '__main__':
    app.run()
