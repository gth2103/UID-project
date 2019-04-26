from app import app, db
from app.models import *

admin = User(username='admin', email='gth2103@columbia.edu')
guest = User(username='guest', email='guest@columbia.edu')

db.session.add(admin)
db.session.add(guest)
db.session.commit()


if __name__ == '__main__':
    app.run()
