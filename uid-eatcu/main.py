from app import app, db
from app.models import *

admin = User(username='admin', email='gth2103@columbia.edu', password_hash=generate_password_hash('admin'))
guest = User(username='guest', email='guest@columbia.edu', password_hash=generate_password_hash('guest'))
grant =  User(username='grant', email='grant@columbia.edu', password_hash=generate_password_hash('grant'))
john =  User(username='john', email='john@columbia.edu', password_hash=generate_password_hash('john'))
jane =  User(username='jane', email='jane@columbia.edu', password_hash=generate_password_hash('jane'))


#db.session.add(guest)
#db.session.add(grant)
#db.session.add(john)
#db.session.add(jane)
#db.session.commit()


if __name__ == '__main__':
    app.run()
