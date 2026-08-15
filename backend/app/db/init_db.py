from app.db.database import Base, engine
from app.models import alert, behaviour_event, customer, emerging_pattern, risk_assessment, transaction


# Importing models above ensures SQLAlchemy metadata is registered.
def init_db() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database tables created successfully.")
